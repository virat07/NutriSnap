# Changelog

## [Unreleased] - 2025-11-24

### Added
- **`babel.config.js`**: Added Babel configuration file with `react-native-reanimated/plugin` to support the latest Expo Router and Reanimated versions.
- **`react-native-worklets`**: Installed `react-native-worklets` as it is a required peer dependency for `react-native-reanimated` v4.

### Changed
- **Expo SDK**: Upgraded project from SDK 53 to SDK 54.
- **Dependencies**:
    - Upgraded `expo` to `^54.0.25`.
    - Upgraded `react-native` to `0.81.5`.
    - Upgraded `react-native-reanimated` to `~4.1.1`.
    - Upgraded other Expo-related packages (`expo-router`, `expo-status-bar`, etc.) to compatible versions using `npx expo install --fix`.
- **Configuration**:
    - Updated `package.json` to reflect new dependency versions.
    - Resolved peer dependency conflicts for `@types/react` and `react-native`.

### Fixed
- **Build Error**: Fixed `Cannot find module 'react-native-worklets/plugin'` error by adding `babel.config.js` and installing the missing worklets package.
