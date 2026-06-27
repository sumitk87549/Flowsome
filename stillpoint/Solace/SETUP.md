# Solace — Developer Environment Setup

## Required Versions
- Node.js: v20.19.4 or higher
- npm: v10.x or higher
- Expo CLI: latest (`npm install -g expo-cli`)
- Xcode (iOS only): 26.4 or newer
- CocoaPods (iOS only): 1.15.x or higher

## Verification Commands
node --version
npm --version
pod --version        # macOS/iOS only
xcodebuild -version  # macOS/iOS only

## Install Dependencies
npx expo install --fix

## Start Dev Server
npx expo start

## Health Checks (run after every install)
npx expo-doctor
npx tsc --noEmit

## Notes
- Android-only development is possible with Expo Go
- iOS must be validated on a real device before any sprint closes
- Never use `npm install` for Expo packages — always use `npx expo install`
- Never add `react-native-reanimated/plugin` to babel.config.js
- Never use `expo-router` or `expo-av`
