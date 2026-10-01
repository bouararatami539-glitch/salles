import JSZip from 'jszip';
import { KOTLIN_PROJECT_FILES } from '../data/kotlinCodeSnippets';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root gradle files
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "CampusNav"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  );

  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  zip.file(
    'gradle/libs.versions.toml',
    `[versions]
agp = "8.7.3"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.12.01"
navigationCompose = "2.8.5"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
  );

  // GitHub Actions Workflow to compile APK automatically in the cloud for free!
  zip.file(
    '.github/workflows/build-apk.yml',
    `name: Build APK Online (Cloud CI)
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Build APK with Gradle
        run: ./gradlew assembleDebug

      - name: Upload Generated APK
        uses: actions/upload-artifact@v4
        with:
          name: CampusNav-app-debug.apk
          path: app/build/outputs/apk/debug/app-debug.apk
`
  );

  // App module files
  zip.file(
    'app/build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.campusnav"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.campusnav"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.material.icons.extended)
}
`
  );

  zip.file(
    'app/src/main/AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="CampusNav"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Material.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  // Add all Kotlin files into their respective paths
  for (const file of KOTLIN_PROJECT_FILES) {
    zip.file(file.path, file.code);
  }

  // Add README with build instructions & online compilation tools
  zip.file(
    'README.md',
    `# CampusNav - Application Android Native Kotlin & Jetpack Compose

## Comment obtenir le fichier .APK ?

### Option A : Compilation 100% en ligne (Sans rien installer sur votre PC)
1. Créez un dépôt gratuit sur **GitHub** (https://github.com/new).
2. Déposez-y tous les fichiers de ce projet.
3. Le fichier \`.github/workflows/build-apk.yml\` déclenche automatiquement la compilation sur les serveurs de GitHub.
4. Rendez-vous dans l'onglet **Actions** de votre dépôt GitHub et téléchargez votre fichier **CampusNav-app-debug.apk** prêt à installer !

### Option B : Avec Android Studio en local
1. Ouvrez **Android Studio** et faites **File > Open** sur ce dossier.
2. Allez dans le menu : **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. Android Studio génère votre fichier dans \`app/build/outputs/apk/debug/app-debug.apk\`.

### Option C : Générateurs d'APK en ligne depuis l'URL
Vous pouvez aussi utiliser un site comme **PWABuilder** (https://www.pwabuilder.com) ou **WebIntoApp** (https://www.webintoapp.com) en entrant simplement l'URL publique de l'application !
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
