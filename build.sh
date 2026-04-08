#!/bin/bash
# AzePSP — Sürətli Build Skripti

echo "============================================"
echo "   AzePSP v1.0 - Build Başladı"
echo "============================================"
echo ""

# ─── 1. JAVA ─────────────────────────────────
JAVA_BIN=$(which java 2>/dev/null || true)

if [ -z "$JAVA_BIN" ]; then
  JAVA_BIN=$(nix-shell -p jdk17 --run "which java" 2>/dev/null || true)
fi

if [ -z "$JAVA_BIN" ]; then
  echo "[XƏTA] Java tapılmadı!"
  exit 1
fi

JAVA_HOME_DIR=$(dirname "$(dirname "$JAVA_BIN")")
export JAVA_HOME="$JAVA_HOME_DIR"
export PATH="$JAVA_HOME/bin:$PATH"
echo "[✓] Java: $(java -version 2>&1 | head -1)"

# ─── 2. ANDROID SDK ──────────────────────────
ANDROID_SDK_ROOT="$HOME/android-sdk"
export ANDROID_SDK_ROOT
export ANDROID_HOME="$ANDROID_SDK_ROOT"
export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"

if [ ! -d "$ANDROID_SDK_ROOT/cmdline-tools/latest/bin" ]; then
  echo "[i] Android SDK yüklənir (~150MB)..."
  mkdir -p "$ANDROID_SDK_ROOT"
  curl -L -s --show-error \
    "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" \
    -o "$ANDROID_SDK_ROOT/cmdline-tools.zip"
  unzip -q "$ANDROID_SDK_ROOT/cmdline-tools.zip" -d "$ANDROID_SDK_ROOT/cmdline-tools-raw"
  mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
  mv "$ANDROID_SDK_ROOT/cmdline-tools-raw/cmdline-tools/"* "$ANDROID_SDK_ROOT/cmdline-tools/latest/"
  rm -rf "$ANDROID_SDK_ROOT/cmdline-tools-raw" "$ANDROID_SDK_ROOT/cmdline-tools.zip"
fi
echo "[✓] Android SDK hazır"

# ─── 3. LİSENZİYALAR + KOMPONENTLƏRPa ──────
yes | sdkmanager --licenses > /dev/null 2>&1 || true
if [ ! -d "$ANDROID_SDK_ROOT/platforms/android-36" ]; then
  echo "[i] Platform + Build tools yüklənir..."
  sdkmanager "platform-tools" "build-tools;36.0.0" "platforms;android-36" > /dev/null 2>&1
fi
echo "[✓] Build tools + Platform hazır"

# ─── 4. NDK ──────────────────────────────────
NDK_VERSION="29.0.14206865"
if [ ! -d "$ANDROID_SDK_ROOT/ndk/$NDK_VERSION" ]; then
  echo "[i] NDK $NDK_VERSION yüklənir (~1.5GB, 10 dəq çəkər)..."
  sdkmanager "ndk;$NDK_VERSION" > /dev/null 2>&1
fi
echo "[✓] NDK $NDK_VERSION hazır"

# ─── 5. LOCAL.PROPERTIES + GRADLE HOME ──────
WORKSPACE_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "sdk.dir=$ANDROID_SDK_ROOT" > "$WORKSPACE_DIR/local.properties"
echo "[✓] local.properties hazır"

# Gradle cache-ni workspace diskine yönləndir (daha çox yer var)
mkdir -p "$WORKSPACE_DIR/.gradle_home"
export GRADLE_USER_HOME="$WORKSPACE_DIR/.gradle_home"

# ─── 6. BUILD SEÇİMİ ─────────────────────────
echo ""
echo "Seçim:"
echo "  1) Debug APK   — tez, test üçün"
echo "  2) Optimized   — tövsiyə edilir"
echo "  3) Clean       — build qovluğunu təmizlə"
echo ""
read -rp "Seçiminiz [1]: " choice
choice="${choice:-1}"

case "$choice" in
  1)
    echo ""
    echo "[BUILD] Debug APK qurulur (20-40 dəq çəkə bilər)..."
    ./gradlew assembleNormalDebug --no-daemon
    APK="android/build/outputs/apk/normal/debug/app-normal-debug.apk"
    ;;
  2)
    echo ""
    echo "[BUILD] Optimized APK qurulur..."
    ./gradlew assembleNormalOptimized --no-daemon
    APK="android/build/outputs/apk/normal/optimized/app-normal-optimized.apk"
    ;;
  3)
    ./gradlew clean --no-daemon
    echo "[✓] Təmizləndi."
    exit 0
    ;;
  *)
    echo "Yanlış seçim"; exit 1 ;;
esac

if [ -f "$APK" ]; then
  echo ""
  echo "============================================"
  echo "  ✓ APK HAZIRDIR!"
  echo "  Yer: $APK"
  echo "  Ölçü: $(du -h "$APK" | cut -f1)"
  echo "============================================"
  echo "  Cihaza quraşdır:  adb install \"$APK\""
  echo "============================================"
else
  echo ""
  echo "[XƏTA] APK tapılmadı — yuxarıdakı xətalara baxın"
  exit 1
fi
