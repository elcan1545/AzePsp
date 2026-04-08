const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

const HTML = `<!DOCTYPE html>
<html lang="az">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AzePSP - Azərbaycan PSP Emulatoru</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --az-blue: #0092BC;
      --az-red: #EF3340;
      --az-green: #509E2F;
      --glass: rgba(255,255,255,0.08);
      --glass-border: rgba(255,255,255,0.22);
      --glass-strong: rgba(255,255,255,0.16);
    }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #000;
      color: #fff;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
      position: relative;
    }

    /* === AZERBAYCAN BAYRAĞI ANİMASİYASI === */
    .flag-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .flag-stripe {
      position: absolute;
      width: 200%;
      left: -50%;
    }

    .flag-stripe.blue {
      top: 0;
      height: 33.33%;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(0,146,188,0.18) 20%,
        rgba(0,146,188,0.30) 40%,
        rgba(0,146,188,0.18) 60%,
        transparent 80%
      );
      animation: waveBlue 6s ease-in-out infinite;
    }

    .flag-stripe.red {
      top: 33.33%;
      height: 33.34%;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(239,51,64,0.18) 20%,
        rgba(239,51,64,0.28) 40%,
        rgba(239,51,64,0.18) 60%,
        transparent 80%
      );
      animation: waveRed 7s ease-in-out infinite 0.5s;
    }

    .flag-stripe.green {
      top: 66.66%;
      height: 33.34%;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(80,158,47,0.18) 20%,
        rgba(80,158,47,0.28) 40%,
        rgba(80,158,47,0.18) 60%,
        transparent 80%
      );
      animation: waveGreen 8s ease-in-out infinite 1s;
    }

    .flag-glow-blue { position: fixed; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(0,146,188,0.12) 0%, transparent 70%); top: -150px; left: 20%; z-index: 0; animation: drift1 12s ease-in-out infinite; }
    .flag-glow-red  { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(239,51,64,0.10) 0%, transparent 70%); top: 20%; right: 10%; z-index: 0; animation: drift2 15s ease-in-out infinite 2s; }
    .flag-glow-green{ position: fixed; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(80,158,47,0.08) 0%, transparent 70%); bottom: -200px; left: 30%; z-index: 0; animation: drift3 18s ease-in-out infinite 4s; }

    @keyframes waveBlue  { 0%,100% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(3%) scaleY(1.04); } }
    @keyframes waveRed   { 0%,100% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-4%) scaleY(1.06); } }
    @keyframes waveGreen { 0%,100% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(2%) scaleY(1.03); } }
    @keyframes drift1    { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px, 30px); } }
    @keyframes drift2    { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px, 50px); } }
    @keyframes drift3    { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-40px); } }

    /* === ANA LAYOUT === */
    .app-layout {
      position: relative;
      z-index: 10;
      display: flex;
      height: 100vh;
      width: 100vw;
    }

    /* === SOL MENÜ === */
    .side-menu {
      width: 72px;
      height: 100vh;
      background: rgba(10,10,10,0.70);
      backdrop-filter: blur(28px) saturate(1.6);
      -webkit-backdrop-filter: blur(28px) saturate(1.6);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      gap: 6px;
      flex-shrink: 0;
    }

    .menu-logo {
      width: 44px;
      height: 44px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-logo svg { width: 44px; height: 44px; }

    .menu-divider {
      width: 36px;
      height: 1px;
      background: var(--glass-border);
      margin: 8px 0;
    }

    .menu-item {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      background: transparent;
      border: none;
    }

    .menu-item:hover, .menu-item.active {
      background: var(--glass-strong);
      border: 1px solid var(--glass-border);
      transform: scale(1.08);
      box-shadow: 0 0 20px rgba(0,146,188,0.35);
    }

    .menu-item svg { width: 22px; height: 22px; fill: rgba(255,255,255,0.55); transition: fill 0.2s; }
    .menu-item:hover svg, .menu-item.active svg { fill: #fff; }

    .menu-tooltip {
      position: absolute;
      left: 62px;
      background: rgba(15,15,20,0.92);
      backdrop-filter: blur(20px);
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      z-index: 100;
    }

    .menu-item:hover .menu-tooltip { opacity: 1; }

    /* === ANA İÇERİK === */
    .main-content {
      flex: 1;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* === INFO PANELİ (sağ üst) === */
    .info-panel {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 50;
      background: rgba(10,10,10,0.60);
      backdrop-filter: blur(20px) saturate(1.5);
      -webkit-backdrop-filter: blur(20px) saturate(1.5);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .info-label { font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; }

    .info-value { font-size: 14px; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
    .info-value.green { color: #4ade80; }
    .info-value.yellow { color: #fbbf24; }

    .info-divider { width: 1px; height: 28px; background: var(--glass-border); }

    .info-badge {
      font-size: 10px;
      font-weight: 600;
      color: var(--az-blue);
      background: rgba(0,146,188,0.14);
      border: 1px solid rgba(0,146,188,0.35);
      border-radius: 8px;
      padding: 3px 8px;
      white-space: nowrap;
      letter-spacing: 0.03em;
    }

    /* === ANA EKRAN === */
    .home-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 80px 24px 24px;
      gap: 28px;
    }

    .app-title {
      text-align: center;
    }

    .app-title h1 {
      font-size: 56px;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, rgba(0,146,188,0.9) 50%, #ffffff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.1;
    }

    .app-title p {
      font-size: 15px;
      color: rgba(255,255,255,0.50);
      margin-top: 6px;
      font-weight: 400;
      letter-spacing: 0.04em;
    }

    .flag-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }

    .flag-mini { display: flex; height: 12px; border-radius: 2px; overflow: hidden; }
    .flag-mini span { display: block; width: 18px; }
    .flag-mini .b { background: #0092BC; }
    .flag-mini .r { background: #EF3340; }
    .flag-mini .g { background: #509E2F; }

    /* === OYUN KARTLARI === */
    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 14px;
      width: 100%;
      max-width: 680px;
    }

    .game-card {
      background: var(--glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    .game-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    .game-card:hover {
      border-color: rgba(0,146,188,0.50);
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 12px 36px rgba(0,146,188,0.22), 0 0 0 1px rgba(0,146,188,0.25);
      background: rgba(0,146,188,0.12);
    }

    .game-icon {
      width: 68px;
      height: 68px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(0,146,188,0.30), rgba(80,158,47,0.20));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
    }

    .game-title { font-size: 11px; font-weight: 600; text-align: center; color: rgba(255,255,255,0.90); line-height: 1.3; }

    /* === GLASS BUTONLAR === */
    .btn-glass {
      background: var(--glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 14px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      padding: 13px 26px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: inline-flex;
      align-items: center;
      gap: 9px;
      position: relative;
      overflow: hidden;
    }

    .btn-glass::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 60%);
    }

    .btn-glass:hover {
      background: var(--glass-strong);
      border-color: rgba(0,146,188,0.55);
      transform: scale(1.04);
      box-shadow: 0 0 24px rgba(0,146,188,0.35);
    }

    .btn-glass:active { transform: scale(0.97); opacity: 0.85; }

    .btn-glass.primary {
      background: rgba(0,146,188,0.22);
      border-color: rgba(0,146,188,0.55);
    }

    .btn-glass.primary:hover {
      background: rgba(0,146,188,0.38);
      box-shadow: 0 0 32px rgba(0,146,188,0.50);
    }

    .btn-row { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

    /* === OYUN KONTROL BUTONLARI === */
    .controller-overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      pointer-events: none;
      display: none;
    }

    .controller-overlay.show { display: block; }

    .game-screen-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #0a0a14, #06080f);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .game-screen-placeholder {
      width: 60%;
      max-width: 400px;
      aspect-ratio: 16/9;
      background: rgba(0,0,0,0.8);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.25);
      font-size: 13px;
    }

    /* D-Pad */
    .dpad {
      position: absolute;
      bottom: 100px;
      left: 50px;
      width: 120px;
      height: 120px;
      display: grid;
      grid-template: repeat(3, 40px) / repeat(3, 40px);
      gap: 0;
      pointer-events: all;
    }

    .dpad-btn {
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.28);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.15s;
      position: relative;
      overflow: hidden;
    }

    .dpad-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.08);
      opacity: 0;
      transition: opacity 0.15s;
    }

    .dpad-btn:hover::after, .dpad-btn:active::after { opacity: 1; }
    .dpad-btn.up    { grid-area: 1/2; border-radius: 8px 8px 0 0; border-bottom-color: transparent; }
    .dpad-btn.left  { grid-area: 2/1; border-radius: 8px 0 0 8px; border-right-color: transparent; }
    .dpad-btn.center{ grid-area: 2/2; background: rgba(255,255,255,0.04); }
    .dpad-btn.right { grid-area: 2/3; border-radius: 0 8px 8px 0; border-left-color: transparent; }
    .dpad-btn.down  { grid-area: 3/2; border-radius: 0 0 8px 8px; border-top-color: transparent; }

    .dpad-btn:active { transform: scale(0.92); }

    /* PSP Face Buttons */
    .face-buttons {
      position: absolute;
      bottom: 100px;
      right: 50px;
      width: 120px;
      height: 120px;
      display: grid;
      grid-template: repeat(3, 40px) / repeat(3, 40px);
      pointer-events: all;
    }

    .face-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.28);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
      margin: auto;
    }

    .face-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18) 0%, transparent 60%);
    }

    .face-btn:hover { transform: scale(1.15); box-shadow: 0 0 16px currentColor; }
    .face-btn:active { transform: scale(0.88); opacity: 0.75; }

    .face-btn.triangle { grid-area: 1/2; color: #4ade80; border-color: rgba(74,222,128,0.45); }
    .face-btn.square   { grid-area: 2/1; color: #f472b6; border-color: rgba(244,114,182,0.45); }
    .face-btn.circle   { grid-area: 2/3; color: #f87171; border-color: rgba(248,113,113,0.45); }
    .face-btn.cross    { grid-area: 3/2; color: #60a5fa; border-color: rgba(96,165,250,0.45); }

    /* L/R Triggers */
    .trigger-l, .trigger-r {
      position: absolute;
      bottom: 226px;
      width: 70px;
      height: 28px;
      border-radius: 8px 8px 0 0;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.28);
      color: rgba(255,255,255,0.70);
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: all;
      transition: all 0.15s;
      letter-spacing: 0.05em;
    }

    .trigger-l { left: 50px; }
    .trigger-r { right: 50px; }
    .trigger-l:hover, .trigger-r:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.50); }
    .trigger-l:active, .trigger-r:active { transform: scaleY(0.90); opacity: 0.70; }

    /* Start / Select */
    .center-buttons {
      position: absolute;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      pointer-events: all;
    }

    .center-btn {
      padding: 6px 14px;
      border-radius: 10px;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.25);
      color: rgba(255,255,255,0.65);
      font-size: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 0.06em;
    }

    .center-btn:hover { background: rgba(255,255,255,0.10); }
    .center-btn:active { transform: scale(0.92); }

    .close-game-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      pointer-events: all;
    }

    /* === AYARLAR EKRANI === */
    .settings-screen {
      flex: 1;
      overflow-y: auto;
      padding: 80px 24px 24px;
      display: none;
    }

    .settings-screen.show { display: block; }

    .settings-section {
      background: var(--glass);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .settings-section-title {
      padding: 14px 18px;
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.45);
      text-transform: uppercase;
      letter-spacing: 0.10em;
      border-bottom: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.03);
    }

    .settings-row {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      transition: background 0.15s;
      cursor: pointer;
    }

    .settings-row:last-child { border-bottom: none; }
    .settings-row:hover { background: rgba(255,255,255,0.05); }

    .settings-row-left { display: flex; flex-direction: column; gap: 3px; }
    .settings-row-label { font-size: 14px; font-weight: 500; color: #fff; }
    .settings-row-desc { font-size: 11px; color: rgba(255,255,255,0.42); }

    .toggle {
      width: 46px;
      height: 26px;
      border-radius: 13px;
      background: rgba(255,255,255,0.18);
      border: 1px solid var(--glass-border);
      position: relative;
      cursor: pointer;
      transition: background 0.3s;
      flex-shrink: 0;
    }

    .toggle.on { background: var(--az-blue); border-color: rgba(0,146,188,0.70); }

    .toggle::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      top: 2px;
      left: 2px;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 2px 6px rgba(0,0,0,0.30);
    }

    .toggle.on::after { transform: translateX(20px); }

    .ai-badge {
      font-size: 10px;
      font-weight: 700;
      color: #fff;
      background: linear-gradient(90deg, var(--az-blue), var(--az-green));
      padding: 3px 10px;
      border-radius: 8px;
      letter-spacing: 0.04em;
    }

    /* === HAQQINDA EKRANI === */
    .about-screen {
      flex: 1;
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 80px 24px 24px;
      gap: 20px;
    }

    .about-screen.show { display: flex; }

    .about-card {
      background: var(--glass);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 28px;
      max-width: 420px;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .about-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,146,188,0.08) 0%, transparent 60%);
    }

    .about-logo {
      font-size: 52px;
      font-weight: 800;
      background: linear-gradient(135deg, #0092BC, #ffffff, #509E2F);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 4px;
    }

    .about-version {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
      margin-bottom: 20px;
    }

    .about-desc {
      font-size: 13px;
      color: rgba(255,255,255,0.70);
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .feature-tags { display: flex; flex-wrap: wrap; gap: 8px; }

    .feature-tag {
      font-size: 11px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 10px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.75);
    }

    .feature-tag.blue   { border-color: rgba(0,146,188,0.45); background: rgba(0,146,188,0.12); color: #5ecef2; }
    .feature-tag.green  { border-color: rgba(80,158,47,0.45); background: rgba(80,158,47,0.12); color: #7dd56f; }
    .feature-tag.red    { border-color: rgba(239,51,64,0.45); background: rgba(239,51,64,0.12); color: #f87171; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.20); border-radius: 2px; }

    /* Screen transitions */
    .screen { display: none; flex: 1; }
    .screen.active { display: flex; flex-direction: column; }
    #homeScreen.active { display: flex; }
    #settingsScreen.active { display: block; }
    #aboutScreen.active { display: flex; }
  </style>
</head>
<body>

<!-- Azerbaycan Bayrağı Animasiyalı Arka Plan -->
<div class="flag-bg">
  <div class="flag-stripe blue"></div>
  <div class="flag-stripe red"></div>
  <div class="flag-stripe green"></div>
  <div class="flag-glow-blue"></div>
  <div class="flag-glow-red"></div>
  <div class="flag-glow-green"></div>
</div>

<div class="app-layout">

  <!-- Sol Menü -->
  <nav class="side-menu">
    <div class="menu-logo">
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="12" fill="rgba(0,146,188,0.25)" stroke="rgba(0,146,188,0.50)" stroke-width="1"/>
        <text x="22" y="29" text-anchor="middle" fill="white" font-size="16" font-weight="800" font-family="Inter,sans-serif">Az</text>
      </svg>
    </div>

    <div class="menu-divider"></div>

    <button class="menu-item active" onclick="showScreen('home')" title="Ana Səhifə">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="fill:none"/></svg>
      <div class="menu-tooltip">Ana Səhifə</div>
    </button>

    <button class="menu-item" onclick="showScreen('load')" title="Oyun Yüklə">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <div class="menu-tooltip">Oyun Yüklə</div>
    </button>

    <button class="menu-item" onclick="showScreen('settings')" title="Ayarlar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 015.34 18.66M4.93 4.93a10 10 0 0013.73 13.73"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
      <div class="menu-tooltip">Ayarlar</div>
    </button>

    <button class="menu-item" onclick="showScreen('about')" title="Haqqında">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div class="menu-tooltip">Haqqında</div>
    </button>

    <div style="flex:1"></div>

    <button class="menu-item" onclick="exitApp()" title="Çıxış">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      <div class="menu-tooltip">Çıxış</div>
    </button>
  </nav>

  <!-- Ana İçerik -->
  <div class="main-content">

    <!-- Real-time Info Paneli -->
    <div class="info-panel" id="infoPanel">
      <div class="info-item">
        <span class="info-label">FPS</span>
        <span class="info-value green" id="fpsValue">60</span>
      </div>
      <div class="info-divider"></div>
      <div class="info-item">
        <span class="info-label">CPU</span>
        <span class="info-value yellow" id="cpuValue">24%</span>
      </div>
      <div class="info-divider"></div>
      <div class="info-item">
        <span class="info-label">RAM</span>
        <span class="info-value" id="ramValue">312MB</span>
      </div>
      <div class="info-divider"></div>
      <span class="info-badge">AzePSP v1.0 · AI</span>
    </div>

    <!-- Ana Ekran -->
    <div id="homeScreen" class="screen active">
      <div class="home-screen">
        <div class="app-title">
          <h1>AzePSP</h1>
          <div class="flag-badge">
            <div class="flag-mini"><span class="b"></span><span class="r"></span><span class="g"></span></div>
            <p>Azərbaycan PSP Emulatoru</p>
          </div>
        </div>

        <div class="games-grid" id="gamesGrid">
          <div class="game-card" onclick="launchGame('God of War')">
            <div class="game-icon">⚔️</div>
            <div class="game-title">God of War: Chains of Olympus</div>
          </div>
          <div class="game-card" onclick="launchGame('Monster Hunter')">
            <div class="game-icon">🗡️</div>
            <div class="game-title">Monster Hunter Freedom Unite</div>
          </div>
          <div class="game-card" onclick="launchGame('GTA')">
            <div class="game-icon">🚗</div>
            <div class="game-title">GTA: Vice City Stories</div>
          </div>
          <div class="game-card" onclick="launchGame('Tekken')">
            <div class="game-icon">🥊</div>
            <div class="game-title">Tekken: Dark Resurrection</div>
          </div>
        </div>

        <div class="btn-row">
          <button class="btn-glass primary" onclick="loadGame()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Oyun Yüklə
          </button>
          <button class="btn-glass" onclick="showScreen('settings')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            Ayarlar
          </button>
        </div>
      </div>
    </div>

    <!-- Ayarlar Ekranı -->
    <div id="settingsScreen" class="screen">
      <div class="settings-screen show">
        <div style="padding:0 0 16px; font-size:22px; font-weight:700; letter-spacing:-0.02em;">Ayarlar</div>

        <!-- AI Performans Modu -->
        <div class="settings-section">
          <div class="settings-section-title">🤖 AI Performans</div>
          <div class="settings-row" onclick="toggleSetting('ai')">
            <div class="settings-row-left">
              <span class="settings-row-label">AI Performans Modu</span>
              <span class="settings-row-desc">Cihazın hardware-ına görə FPS və çözünürlüyü avtomatik optimallaşdırır</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="ai-badge">AI</span>
              <div class="toggle on" id="toggle-ai"></div>
            </div>
          </div>
          <div class="settings-row" onclick="toggleSetting('adaptive')">
            <div class="settings-row-left">
              <span class="settings-row-label">Adaptiv Çözünürlük</span>
              <span class="settings-row-desc">Performansa görə dinamik olaraq uyğunlaşır</span>
            </div>
            <div class="toggle on" id="toggle-adaptive"></div>
          </div>
        </div>

        <!-- Qrafika Ayarları -->
        <div class="settings-section">
          <div class="settings-section-title">🎨 Qrafika</div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-label">Çözünürlük</span>
              <span class="settings-row-desc">Hazırda: 2x (960x544)</span>
            </div>
            <span style="font-size:13px;color:rgba(255,255,255,0.50);font-weight:500">2x ›</span>
          </div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-label">FPS Limiti</span>
              <span class="settings-row-desc">Maksimum kadr sayı</span>
            </div>
            <span style="font-size:13px;color:rgba(255,255,255,0.50);font-weight:500">60 ›</span>
          </div>
          <div class="settings-row" onclick="toggleSetting('vsync')">
            <div class="settings-row-left">
              <span class="settings-row-label">Şaquli Sinxronizasiya</span>
            </div>
            <div class="toggle on" id="toggle-vsync"></div>
          </div>
          <div class="settings-row" onclick="toggleSetting('aniso')">
            <div class="settings-row-left">
              <span class="settings-row-label">Anizotrop Filtr</span>
            </div>
            <div class="toggle" id="toggle-aniso"></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-label">Tekstura Filtri</span>
            </div>
            <span style="font-size:13px;color:rgba(255,255,255,0.50);font-weight:500">Linear ›</span>
          </div>
        </div>

        <!-- Performans -->
        <div class="settings-section">
          <div class="settings-section-title">⚡ Performans</div>
          <div class="settings-row" onclick="setMode('performance')">
            <div class="settings-row-left">
              <span class="settings-row-label">Performans Modu</span>
            </div>
            <div class="toggle" id="toggle-perf"></div>
          </div>
          <div class="settings-row" onclick="setMode('battery')">
            <div class="settings-row-left">
              <span class="settings-row-label">Batareya Modu</span>
            </div>
            <div class="toggle" id="toggle-batt"></div>
          </div>
          <div class="settings-row" onclick="setMode('balanced')">
            <div class="settings-row-left">
              <span class="settings-row-label">Balanslaşdırılmış Mod</span>
            </div>
            <div class="toggle on" id="toggle-bal"></div>
          </div>
        </div>

        <!-- Ses -->
        <div class="settings-section">
          <div class="settings-section-title">🔊 Ses</div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-label">Həcm</span>
            </div>
            <input type="range" min="0" max="100" value="80"
              style="accent-color:var(--az-blue);width:100px;cursor:pointer">
          </div>
          <div class="settings-row" onclick="toggleSetting('sound')">
            <div class="settings-row-left">
              <span class="settings-row-label">Ses Aktiv</span>
            </div>
            <div class="toggle on" id="toggle-sound"></div>
          </div>
        </div>

        <!-- Dil -->
        <div class="settings-section">
          <div class="settings-section-title">🌐 Sistem</div>
          <div class="settings-row">
            <div class="settings-row-left">
              <span class="settings-row-label">Dil</span>
              <span class="settings-row-desc">Azərbaycan dili</span>
            </div>
            <span style="font-size:13px;color:rgba(255,255,255,0.50);font-weight:500">AZ 🇦🇿 ›</span>
          </div>
        </div>

        <div class="btn-row" style="margin-top:8px">
          <button class="btn-glass primary">Ayarları Saxla</button>
          <button class="btn-glass">Standarta Sıfırla</button>
        </div>
      </div>
    </div>

    <!-- Haqqında Ekranı -->
    <div id="aboutScreen" class="screen">
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px 24px 24px;gap:16px">
        <div class="about-card">
          <div class="about-logo">AzePSP</div>
          <div class="about-version">Versiya 1.0.0 · AI Gücləndirilmiş · PPSSPP Əsaslı</div>
          <div class="about-desc">
            AzePSP — Azərbaycan temalı, müasir Glassmorphism dizaynlı PSP emulatoru.
            PPSSPP açıq mənbə layihəsi əsasında hazırlanmış, AI optimallaşdırma
            texnologiyası ilə gücləndirilmiş, tam Azərbaycan dili dəstəyi olan
            yeni nəsil PSP emulyatoru.
          </div>
          <div class="feature-tags">
            <span class="feature-tag blue">🤖 AI Optimallaşdırma</span>
            <span class="feature-tag">✨ Glassmorphism UI</span>
            <span class="feature-tag green">🇦🇿 Azərbaycan Mövzusu</span>
            <span class="feature-tag blue">📊 Gerçek Zamanlı FPS</span>
            <span class="feature-tag red">🎮 PSP Emulatoru</span>
            <span class="feature-tag">🌊 Bayraq Animasiyası</span>
          </div>
        </div>
        <div class="about-card" style="max-width:420px;width:100%">
          <div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.50);text-transform:uppercase;letter-spacing:0.10em;margin-bottom:14px">Əsas alınan</div>
          <div style="font-size:15px;font-weight:600;color:#fff">PPSSPP Layihəsi</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.45);margin-top:4px">Henrik Rydgård tərəfindən — GPLv2 Lisenziyası</div>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- Oyun Kontrolcu Overlay -->
<div class="controller-overlay" id="controllerOverlay">
  <div class="game-screen-bg">
    <div class="game-screen-placeholder" id="gameName">Oyun yüklənir...</div>
  </div>

  <div class="trigger-l">L</div>
  <div class="trigger-r">R</div>

  <!-- D-Pad -->
  <div class="dpad">
    <button class="dpad-btn up">▲</button>
    <button class="dpad-btn left">◄</button>
    <button class="dpad-btn center"></button>
    <button class="dpad-btn right">►</button>
    <button class="dpad-btn down">▼</button>
  </div>

  <!-- Face Buttons -->
  <div class="face-buttons">
    <button class="face-btn triangle">△</button>
    <button class="face-btn square">□</button>
    <button class="face-btn circle">○</button>
    <button class="face-btn cross">✕</button>
  </div>

  <!-- Center Buttons -->
  <div class="center-buttons">
    <button class="center-btn">SELECT</button>
    <button class="center-btn">HOME</button>
    <button class="center-btn">START</button>
  </div>

  <!-- Kapat -->
  <div class="close-game-btn">
    <button class="btn-glass" onclick="closeGame()" style="font-size:12px;padding:8px 16px">✕ Çıx</button>
  </div>

  <!-- Oyun İçi Info Panel -->
  <div style="position:absolute;top:16px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.55);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.18);border-radius:12px;padding:8px 16px;display:flex;gap:14px;align-items:center;">
    <span style="font-size:10px;color:rgba(255,255,255,0.45);font-weight:600;text-transform:uppercase;letter-spacing:0.08em">FPS</span>
    <span style="font-size:15px;font-weight:800;color:#4ade80" id="gameFps">60</span>
    <span style="width:1px;height:20px;background:rgba(255,255,255,0.15)"></span>
    <span style="font-size:10px;color:rgba(255,255,255,0.45);font-weight:600;text-transform:uppercase;letter-spacing:0.08em">CPU</span>
    <span style="font-size:15px;font-weight:800;color:#fbbf24" id="gameCpu">24%</span>
    <span style="width:1px;height:20px;background:rgba(255,255,255,0.15)"></span>
    <span style="font-size:11px;font-weight:700;color:rgba(0,146,188,0.90)">AzePSP v1.0</span>
  </div>
</div>

<script>
  let currentFps = 60;
  let currentCpu = 24;
  let fpsDir = 1;
  let cpuDir = 1;

  function updateStats() {
    currentFps += (Math.random() - 0.5) * 4 * fpsDir;
    currentCpu += (Math.random() - 0.5) * 6 * cpuDir;
    currentFps = Math.max(45, Math.min(60, currentFps));
    currentCpu = Math.max(10, Math.min(65, currentCpu));

    const fpsEl = document.getElementById('fpsValue');
    const cpuEl = document.getElementById('cpuValue');
    const gameFps = document.getElementById('gameFps');
    const gameCpu = document.getElementById('gameCpu');

    const fps = Math.round(currentFps);
    const cpu = Math.round(currentCpu);

    fpsEl.textContent = fps;
    fpsEl.className = 'info-value ' + (fps >= 55 ? 'green' : fps >= 40 ? 'yellow' : '');

    cpuEl.textContent = cpu + '%';
    cpuEl.className = 'info-value ' + (cpu < 40 ? 'green' : cpu < 60 ? 'yellow' : '');

    const ram = Math.round(280 + Math.random() * 80);
    document.getElementById('ramValue').textContent = ram + 'MB';

    if (gameFps) gameFps.textContent = fps;
    if (gameCpu) gameCpu.textContent = cpu + '%';
  }

  setInterval(updateStats, 800);

  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    if (name === 'home') {
      document.getElementById('homeScreen').classList.add('active');
      document.querySelectorAll('.menu-item')[1].classList.add('active');
    } else if (name === 'settings') {
      document.getElementById('settingsScreen').classList.add('active');
      document.querySelectorAll('.menu-item')[3].classList.add('active');
    } else if (name === 'about') {
      document.getElementById('aboutScreen').classList.add('active');
      document.querySelectorAll('.menu-item')[4].classList.add('active');
    } else if (name === 'load') {
      loadGame();
      document.getElementById('homeScreen').classList.add('active');
      document.querySelectorAll('.menu-item')[2].classList.add('active');
    }
  }

  function toggleSetting(id) {
    const el = document.getElementById('toggle-' + id);
    if (el) el.classList.toggle('on');
  }

  function setMode(mode) {
    ['perf', 'batt', 'bal'].forEach(m => {
      const el = document.getElementById('toggle-' + m);
      if (el) el.classList.remove('on');
    });
    const map = { performance: 'perf', battery: 'batt', balanced: 'bal' };
    const el = document.getElementById('toggle-' + map[mode]);
    if (el) el.classList.add('on');
  }

  function loadGame() {
    alert('AzePSP: ISO faylı seçin (.iso, .cso)\\n\\nAndroid-də bu funksiya tam işləyəcək.');
  }

  function launchGame(name) {
    document.getElementById('gameName').textContent = name + ' — oynayır';
    document.getElementById('controllerOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeGame() {
    document.getElementById('controllerOverlay').classList.remove('show');
  }

  function exitApp() {
    if (confirm('AzePSP-dən çıxmaq istəyirsiniz?')) {
      window.close();
    }
  }

  // Ana menüdeki ilk buton seçili
  document.querySelectorAll('.menu-item')[1].classList.add('active');
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end(HTML);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('AzePSP önizləmə serveri başladı: http://0.0.0.0:' + PORT);
});
