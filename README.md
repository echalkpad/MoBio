MoBio
=======

An Android system for collecting data from electrophysiology sensors. These data are synchronized with EEGBase (http://eegdatabase.kiv.zcu.cz)

Installation guide
-----------
### Android SDK

* Download and install [Android SDK](http://dl.google.com/android/installer_r24.4.1-windows.exe) 
* Cordova requires the `ANDROID_HOME` environment variable to be set. This should point to the `[ANDROID_SDK_DIR]\android-sdk` directory (for example `c:\android\android-sdk`).
* Next, update your `PATH` to include the `tools/` and `platform-tools/` folder in that folder. So, using `ANDROID_HOME`, you would add both `%ANDROID_HOME%\tools` and `%ANDROID_HOME%\platform-tools`

Please refer to [Ionic documentation](http://ionicframework.com/docs/guide/installation.html)

### Cordova and Ionic framework 

* Install both globally `npm install -g cordova ionic`

### Node.js

Node.js verion 0.12.2 is required for the used node modules.

* Download and install [Node.js 0.12.2](https://nodejs.org/download/release/v0.12.2/)

### Preparing the build

Run the following commands

1. `git clone https://github.com/NEUROINFORMATICS-GROUP-FAV-KIV-ZCU/MoBio.git`
2. `npm install`
3. `ionic state reset` (recommended) or `ionic platform add android@4.1.1`
4. `ionic browser add crosswalk`

### Building the app for development

1. Run the command `ionic build android`
2. The APK is located in `[PROJECT_DIR]\platforms\android\build\outputs\apk`
3. Use APK for the required architecture, e.g. `android-armv7-debug.apk`

### Building the app for release

1. Run the command `ionic build --release android`
2. The APK is located in `[PROJECT_DIR]\platforms\android\build\outputs\apk`
3. Use APK for the required architecture, e.g. `android-armv7-release-unsigned.apk`

### Signing the APK

To sign the unsigned APK, run the `jarsigner` tool which is also included in the JDK:
You can use the signing key provided in this repository if you are member of Neuroinformatics group.
The password is required. You need to contact the [Author](mailto:lubosmuller@seznam.cz).

* `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mobio-release-key.keystore android-armv7-release-unsigned.apk mobio`

Run the zip align tool to optimize the APK. The `zipalign` tool can be found in `/path/to/Android/sdk/build-tools/VERSION/zipalign`

* `zipalign -v 4 android-armv7-release-unsigned.apk MoBio.apk`

Now you have your final release binary called **MoBio.apk**.