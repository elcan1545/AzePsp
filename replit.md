# AzePSP — Azərbaycan PSP Emulatoru

PPSSPP açıq mənbə emulatoru əsasında hazırlanmış, Azərbaycan temalı PSP emulatoru.
Həqiqi ISO faylları açılır, standart PPSSPP interfeysi işlənib.

## Edilən Dəyişikliklər (AzePSP üçün)

| Fayl | Dəyişiklik |
|------|-----------|
| `android/res/values/strings.xml` | App adı AzePSP oldu |
| `UI/Background.cpp` | Dalğa animasiyası Azərbaycan bayrağı rənglərindədir |
| `Core/Config.h` | `bAIPerformanceMode` sahəsi əlavə edildi |
| `Core/Config.cpp` | AIPerformanceMode ayarı qeydə alındı |
| `UI/GameSettingsScreen.cpp` | AI Performans Modu UI seçimi əlavə edildi |
| `UI/DebugOverlay.cpp` | "AzePSP v1.0 - AI Enhanced" yazısı əlavə edildi |
| `assets/lang/az_AZ.ini` | AI Performans Modu tərcüməsi əlavə edildi |

## Önizləmə

`preview-server.js` — AzePSP UI-nin interaktiv veb önizləməsini port 5000-də göstərir.

## APK Qurmaq

`BUILD_AZEPSP.md` faylına baxın. Qısa:

```bash
cd android
./gradlew assembleNormalDebug     # Debug APK
./gradlew assembleNormalOptimized # Optimized APK
./gradlew assembleNormalRelease   # Release APK (keystore lazımdır)
```

## Arxitektura

- **C++ core**: PPSSPP emulyasiya mühərriki
- **Android**: `android/` — Gradle build sistemi, Java wrapper
- **UI**: `UI/` — C++ interfeys faylları
- **Assets**: `assets/lang/az_AZ.ini` — Azərbaycan dili
