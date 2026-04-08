import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {Colors, BorderRadius, Typography, Spacing} from '../theme/theme';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import az from '../i18n/az';

const SettingsRow = ({label, desc, value, onToggle, type = 'toggle', rightLabel}) => {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={type === 'toggle' ? onToggle : undefined}
      activeOpacity={type === 'toggle' ? 0.75 : 1}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        {desc ? <Text style={styles.rowDesc}>{desc}</Text> : null}
      </View>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{false: 'rgba(255,255,255,0.18)', true: Colors.azerbaijanBlue}}
          thumbColor={value ? '#fff' : 'rgba(255,255,255,0.75)'}
          ios_backgroundColor="rgba(255,255,255,0.18)"
        />
      )}
      {type === 'nav' && (
        <Text style={styles.navArrow}>{rightLabel || '›'}</Text>
      )}
    </TouchableOpacity>
  );
};

const SectionTitle = ({title}) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    aiMode: true,
    adaptiveRes: true,
    vsync: true,
    anisotropic: false,
    performanceMode: false,
    batteryMode: false,
    balancedMode: true,
    sound: true,
    frameSkip: false,
  });

  const toggle = key => setSettings(prev => ({...prev, [key]: !prev[key]}));

  const saveSettings = () => {
    Alert.alert('AzePSP', 'Ayarlar uğurla saxlanıldı!');
  };

  const resetSettings = () => {
    Alert.alert(
      'Standarta Sıfırla',
      'Bütün ayarlar standart dəyərlərinə qaytarılacaq. Davam edilsin?',
      [
        {text: 'Ləğv et', style: 'cancel'},
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: () => setSettings({
            aiMode: true, adaptiveRes: true, vsync: true, anisotropic: false,
            performanceMode: false, batteryMode: false, balancedMode: true,
            sound: true, frameSkip: false,
          }),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      <Text style={styles.screenTitle}>{az.settings.title}</Text>

      {/* AI Performans Modu */}
      <GlassCard style={styles.section} radius="xl">
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>🤖  {az.settings.aiMode}</Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </View>
        <SettingsRow
          label={az.settings.aiMode}
          desc={az.settings.aiModeDesc}
          value={settings.aiMode}
          onToggle={() => toggle('aiMode')}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label="Adaptiv Çözünürlük"
          desc="Performansa görə dinamik olaraq dəyişir"
          value={settings.adaptiveRes}
          onToggle={() => toggle('adaptiveRes')}
        />
      </GlassCard>

      {/* Qrafika */}
      <SectionTitle title={`🎨  ${az.settings.graphics}`} />
      <GlassCard style={styles.section} radius="xl">
        <SettingsRow
          label={az.settings.resolution}
          type="nav"
          rightLabel="2x (960×544) ›"
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.fps}
          type="nav"
          rightLabel="60 FPS ›"
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.frameskip}
          value={settings.frameSkip}
          onToggle={() => toggle('frameSkip')}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.vsync}
          value={settings.vsync}
          onToggle={() => toggle('vsync')}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.anisotropic}
          value={settings.anisotropic}
          onToggle={() => toggle('anisotropic')}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.textureFilter}
          type="nav"
          rightLabel="Linear ›"
        />
      </GlassCard>

      {/* Performans */}
      <SectionTitle title={`⚡  ${az.settings.performanceMode}`} />
      <GlassCard style={styles.section} radius="xl">
        <SettingsRow
          label={az.settings.performanceMode}
          desc="Maksimum FPS, daha çox batareya istifadəsi"
          value={settings.performanceMode}
          onToggle={() => setSettings(p => ({...p, performanceMode: true, batteryMode: false, balancedMode: false}))}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.batteryMode}
          desc="Aşağı FPS, batareya qənaəti"
          value={settings.batteryMode}
          onToggle={() => setSettings(p => ({...p, performanceMode: false, batteryMode: true, balancedMode: false}))}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.balancedMode}
          desc="Tarazlaşdırılmış performans (tövsiyə edilir)"
          value={settings.balancedMode}
          onToggle={() => setSettings(p => ({...p, performanceMode: false, batteryMode: false, balancedMode: true}))}
        />
      </GlassCard>

      {/* Ses */}
      <SectionTitle title={`🔊  ${az.settings.audio}`} />
      <GlassCard style={styles.section} radius="xl">
        <SettingsRow
          label="Ses Aktiv"
          value={settings.sound}
          onToggle={() => toggle('sound')}
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.volume}
          type="nav"
          rightLabel="80% ›"
        />
        <View style={styles.rowDivider} />
        <SettingsRow
          label={az.settings.audioLatency}
          type="nav"
          rightLabel="Orta ›"
        />
      </GlassCard>

      {/* Sistem */}
      <SectionTitle title={`🌐  Sistem`} />
      <GlassCard style={styles.section} radius="xl">
        <SettingsRow
          label={az.settings.language}
          desc={az.settings.azerbaijani}
          type="nav"
          rightLabel="AZ 🇦🇿 ›"
        />
      </GlassCard>

      {/* Butonlar */}
      <View style={styles.btnRow}>
        <GlassButton
          label={az.settings.saveSettings}
          variant="primary"
          onPress={saveSettings}
          style={styles.btn}
        />
        <GlassButton
          label={az.settings.resetDefault}
          onPress={resetSettings}
          style={styles.btn}
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {
    paddingTop: 70,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  aiBadge: {
    backgroundColor: Colors.azerbaijanBlue,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.40)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  section: {
    marginBottom: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 13,
    minHeight: 56,
  },
  rowLeft: {
    flex: 1,
    marginRight: Spacing.base,
  },
  rowLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
  },
  rowDesc: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 3,
    lineHeight: 15,
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: Spacing.base,
  },
  navArrow: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  btn: {flex: 1},
});

export default SettingsScreen;
