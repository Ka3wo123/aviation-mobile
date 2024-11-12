# Launching app
1. Plugin phone via USB and enable files transfer
2. Run `adb start-server` or `adb devices`
3. From root folder run `npm start` and press `a` to run on Android
4. If error occurs `RNGP - Autolinking: Could not find project.android.packageName in react-native config output! Could not autolink packages without this field.` clear `build/` in android folder and run `npm start`