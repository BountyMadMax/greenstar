## GreenStar

GreenStar is a simple App for adding and reviewing (green) tea.

Developed for Fairphone 6 (Android).

### Dev

#### Stack

- [Tauri](https://tauri.app)
- [Svelte](https://svelte.dev)
- [TypeScript](https://typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [Skeleton](https://skeleton.dev)
- [tauri-plugin-sql v2](https://github.com/tauri-apps/tauri-plugin-sql/tree/v2)

##### Running

`npm run tauri build`

##### Building

Make sure to do [Android Code Signing](https://tauri.app/distribute/sign/android) before building.

`npm run tauri android build`

##### Install / Update apk

`adb install src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk`

