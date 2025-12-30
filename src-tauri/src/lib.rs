use tauri_plugin_sql::{Migration, MigrationKind};

fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_intial_tables",
        sql: r#"
-- 1. Lookup Tables
CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

-- 2. Main Tea Table
CREATE TABLE IF NOT EXISTS teas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    rating REAL,
    
    -- Relationships
    country_of_origin_id INTEGER REFERENCES countries (id),
    city_of_origin_id INTEGER REFERENCES cities (id),
    production_company_id INTEGER REFERENCES companies (id),
    buy_company_id INTEGER REFERENCES companies (id),
    
    -- Metrics
    brewing_time_low INTEGER,
    brewing_time_high INTEGER,
    tea_gram_per_cup REAL,
    brewing_temperature_low INTEGER,
    brewing_temperature_high INTEGER,
    price_per_100gram REAL
);

-- 3. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tea_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    rating INTEGER NOT NULL,
    review TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tea_id) REFERENCES teas (id) ON DELETE CASCADE
);
"#,
        kind: MigrationKind::Up,
    }]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:greenstar.db", get_migrations())
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
