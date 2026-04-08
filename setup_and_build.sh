#!/bin/bash
# AzePSP — Avtomatik Qurulum və APK Build Skripti
# Bu skripti layihənin kök qovluğunda işlədin: bash setup_and_build.sh
set -e

echo "========================================"
echo "  AzePSP — Avtomatik Qurulum Başladı"
echo "========================================"

# ── 1. Java yoxla ─────────────────────────────────────────────
if ! command -v java &>/dev/null; then
  echo ""
  echo "[XƏTA] Java tapılmadı!"
  echo "Android Studio-nu yükləyin: https://developer.android.com/studio"
  echo "YA DA:"
  echo "  Ubuntu/Debian:  sudo apt install openjdk-17-jdk"
  echo "  macOS:          brew install openjdk@17"
  echo "  Windows:        https://adoptium.net"
  exit 1
fi
echo "[OK] Java: $(java -version 2>&1 | head -1)"

# ── 2. Android SDK yoxla ──────────────────────────────────────
if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
  # Standart yerlərə bax
  POSSIBLE_PATHS=(
    "$HOME/Android/Sdk"
    "$HOME/Library/Android/sdk"
    "/opt/android-sdk"
    "C:/Users/$USER/AppData/Local/Android/Sdk"
  )
  for p in "${POSSIBLE_PATHS[@]}"; do
    if [ -d "$p" ]; then
      export ANDROID_SDK_ROOT="$p"
      break
    fi
  done
fi

if [ -z "$ANDROID_SDK_ROOT" ]; then
  echo ""
  echo "[XƏTA] Android SDK tapılmadı!"
  echo ""
  echo "Həll:"
  echo "  1. Android Studio açın"
  echo "  2. SDK Manager → SDK Tools → NDK (Side by side) quraşdırın"
  echo "  3. Sonra bu mühit dəyişənini əlavə edin:"
  echo "     export ANDROID_SDK_ROOT=\$HOME/Android/Sdk"
  echo "     export ANDROID_NDK_ROOT=\$ANDROID_SDK_ROOT/ndk/29.0.14206865"
  echo ""
  echo "Daha sonra bu skripti yenidən işlədin."
  exit 1
fi
echo "[OK] Android SDK: $ANDROID_SDK_ROOT"

# ── 3. NDK yoxla ──────────────────────────────────────────────
NDK_VERSION="29.0.14206865"
ANDROID_NDK_ROOT="${ANDROID_NDK_ROOT:-$ANDROID_SDK_ROOT/ndk/$NDK_VERSION}"

if [ ! -d "$ANDROID_NDK_ROOT" ]; then
  echo ""
  echo "[XƏTA] NDK $NDK_VERSION tapılmadı: $ANDROID_NDK_ROOT"
  echo ""
  echo "Həll: Android Studio → SDK Manager → SDK Tools → NDK (Side by side)"
  echo "NDK versiyası: $NDK_VERSION"
  exit 1
fi
echo "[OK] Android NDK: $ANDROID_NDK_ROOT"

# ── 4. Mühit dəyişənlərini ixrac et ──────────────────────────
export ANDROID_SDK_ROOT
export ANDROID_NDK_ROOT
export PATH="$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools:$PATH"

echo ""
echo "──────────────────────────────────────"
echo "  Seçim: Hansı APK versiyasını qurmaq istəyirsiniz?"
echo "──────────────────────────────────────"
echo "  1) Debug APK   — tez, imzasız, test üçün"
echo "  2) Optimized   — sürətli, optimallaşdırılmış (tövsiyə)"
echo "  3) Release     — imzalı, Play Store üçün"
echo ""
read -rp "Seçiminiz (1/2/3) [2]: " choice
choice="${choice:-2}"

case "$choice" in
  1) TARGET="assembleNormalDebug"
     APK_PATH="android/build/outputs/apk/normal/debug/app-normal-debug.apk" ;;
  2) TARGET="assembleNormalOptimized"
     APK_PATH="android/build/outputs/apk/normal/optimized/app-normal-optimized.apk" ;;
  3) TARGET="assembleNormalRelease"
     APK_PATH="android/build/outputs/apk/normal/release/app-normal-release.apk"
     echo ""
     echo "[XƏBƏRDARLIQ] Release üçün keystore lazımdır."
     echo "gradle.properties faylında aşağıdakıları təyin edin:"
     echo "  RELEASE_STORE_FILE=../azepsp-release.keystore"
     echo "  RELEASE_STORE_PASSWORD=..."
     echo "  RELEASE_KEY_ALIAS=azepsp"
     echo "  RELEASE_KEY_PASSWORD=..."
     ;;
  *) echo "Yanlış seçim"; exit 1 ;;
esac

echo ""
echo "========================================"
echo "  Build başladı: $TARGET"
echo "  (Bu 10-30 dəqiqə çəkə bilər...)"
echo "========================================"
echo ""

./gradlew "$TARGET" --no-daemon

echo ""
if [ -f "$APK_PATH" ]; then
  SIZE=$(du -h "$APK_PATH" | cut -f1)
  echo "========================================"
  echo "  APK uğurla quruldu!"
  echo "  Yer:  $APK_PATH"
  echo "  Ölçü: $SIZE"
  echo "========================================"
  echo ""
  echo "Cihaza yükləmək üçün:"
  echo "  adb install \"$APK_PATH\""
else
  echo "[XƏTA] APK tapılmadı. Yuxarıdakı xətalara baxın."
  exit 1
fi
