MoBio
=======

An Android system for collecting data from electrophysiology sensors. These data are synchronized with EEGBase (http://eegdatabase.kiv.zcu.cz)

Installation guide
-----------
### Android SDK

* Download and install [Android SDK](http://dl.google.com/android/installer_r24.4.1-windows.exe) 
* Cordova requires the ANDROID_HOME environment variable to be set. This should point to the [ANDROID_SDK_DIR]\android-sdk directory (for example c:\android\android-sdk).
* Next, update your PATH to include the tools/ and platform-tools/ folder in that folder. So, using ANDROID_HOME, you would add both %ANDROID_HOME%\tools and %ANDROID_HOME%\platform-tools
 
### Node.js

Node.js verion 0.12.2 is required for hooks.

* Download and install [Node.js 0.12.2](https://nodejs.org/download/release/v0.12.2/)

### Preparing the build

Run the following commands

1. `git clone https://github.com/NEUROINFORMATICS-GROUP-FAV-KIV-ZCU/MoBio.git`
2. `npm install`
3. `ionic state reset`
4. `ionic browser add crosswalk`

