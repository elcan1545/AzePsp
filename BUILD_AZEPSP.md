# AzePSP — APK Qurmaq Üçün Təlimat

## ÖNƏMLİ — Replit-də Build Olmaz

Android APK qurmaq üçün **Android SDK + NDK (+5GB)** lazımdır.
Bu, Replit mühitinə sığmır. **APK-nı öz kompüterinizdə qurun.**

---

## Ən Asan Yol — Avtomatik Skript

Layihəni kompüterinizə endirin, sonra:

```bash
bash setup_and_build.sh
```

Skript:
- Java, Android SDK, NDK mövcudluğunu yoxlayır
- Hansı APK istədiyinizi soruşur (Debug / Optimized / Release)
- Avtomatik qurar, APK yerini göstərər

---

## Manuel Qurulum

### 1. Tələblər

| Alət | Versiya | Yükləmə |
|------|---------|---------|
| **Android Studio** | Son versiya | [developer.android.com/studio](https://developer.android.com/studio) |
| **JDK** | 17 | Android Studio ilə gəlir |
| **NDK** | 29.0.14206865 | Android Studio → SDK Manager |
| **CMake** | 3.22+ | Android Studio → SDK Manager |

### 2. NDK Quraşdırma (Android Studio-da)

```
Android Studio açın
  → SDK Manager (üst sağ ⚙ ikonu)
  → SDK Tools tabı
  → ✅ NDK (Side by side)   ← bunu seçin
  → ✅ CMake                ← bunu seçin
  → Apply
```

### 3. Mühit Dəyişənlərini Qurun

**Linux / macOS** — `~/.bashrc` və ya `~/.zshrc`-a əlavə edin:
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export ANDROID_NDK_ROOT=$ANDROID_SDK_ROOT/ndk/29.0.14206865
export JAVA_HOME=$ANDROID_SDK_ROOT/../jre   # Studio JDK yeri
export PATH=$JAVA_HOME/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH
```

**Windows** — Sistem Xüsusiyyətləri → Mühit Dəyişənləri:
```
ANDROID_SDK_ROOT = C:\Users\AD\AppData\Local\Android\Sdk
ANDROID_NDK_ROOT = C:\Users\AD\AppData\Local\Android\Sdk\ndk\29.0.14206865
JAVA_HOME        = C:\Program Files\Android\Android Studio\jbr
```

---

## gradlew Harada?

```
~/workspace/             ← BURADADIR: gradlew
~/workspace/android/     ← BURDA DEYİL
```

---

## Komandalar — Layihənin KÖK qovluğundan işlədin

```bash
# Debug APK (ən sürətli — test üçün)
./gradlew assembleNormalDebug

# Optimized APK (tövsiyə edilir)
./gradlew assembleNormalOptimized

# Release APK (keystore lazımdır)
./gradlew assembleNormalRelease

# Temizlik
./gradlew clean
```

---

## APK Harada Çıxır?

| Variant | Yer |
|---------|-----|
| Debug | `android/build/outputs/apk/normal/debug/app-normal-debug.apk` |
| Optimized | `android/build/outputs/apk/normal/optimized/app-normal-optimized.apk` |
| Release | `android/build/outputs/apk/normal/release/app-normal-release.apk` |

---

## Cihaza Yükləmək (ADB)

```bash
# USB ilə bağlı cihaza yüklə
adb install android/build/outputs/apk/normal/debug/app-normal-debug.apk

# Əvvəlki versiyası varsa üzərinə yaz
adb install -r android/build/outputs/apk/normal/debug/app-normal-debug.apk
```

---

## İmzalı Release APK (Play Store)

### Keystore yaradın (bir dəfə):
```bash
keytool -genkey -v \
  -keystore azepsp-release.keystore \
  -alias azepsp \
  -keyalg RSA -keysize 2048 -validity 10000
```

### `gradle.properties`-ə əlavə edin:
```properties
RELEASE_STORE_FILE=../azepsp-release.keystore
RELEASE_STORE_PASSWORD=SIFRENIZ
RELEASE_KEY_ALIAS=azepsp
RELEASE_KEY_PASSWORD=SIFRENIZ
```

### Build edin:
```bash
./gradlew assembleNormalRelease
```

---

## AzePSP — Edilən Dəyişikliklər

| Fayl | Dəyişiklik |
|------|-----------|
| `android/res/values/strings.xml` | App adı → **AzePSP** |
| `UI/Background.cpp` | Dalğa animasiyası Azərbaycan bayrağı rəngləri |
| `Core/Config.h` / `Config.cpp` | AI Performans Modu konfiqurasiyası |
| `UI/GameSettingsScreen.cpp` | AI Performans Modu seçimi |
| `UI/DebugOverlay.cpp` | "AzePSP v1.0 - AI Enhanced" yazısı |
| `assets/lang/az_AZ.ini` | Azərbaycanca tərcümə tamamlandı |
