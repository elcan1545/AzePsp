import React from 'react';
import {View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity} from 'react-native';
import {Colors, BorderRadius, Typography, Spacing} from '../theme/theme';
import GlassCard from '../components/GlassCard';
import az from '../i18n/az';

const FeatureTag = ({label, variant = 'default'}) => {
  const colors = {
    default: {bg: Colors.glass, border: Colors.glassBorder, text: Colors.textSecondary},
    blue: {bg: 'rgba(0,146,188,0.12)', border: 'rgba(0,146,188,0.45)', text: '#5ecef2'},
    green: {bg: 'rgba(80,158,47,0.12)', border: 'rgba(80,158,47,0.45)', text: '#7dd56f'},
    red: {bg: 'rgba(239,51,64,0.12)', border: 'rgba(239,51,64,0.45)', text: '#f87171'},
  };
  const c = colors[variant];
  return (
    <View style={[styles.tag, {backgroundColor: c.bg, borderColor: c.border}]}>
      <Text style={[styles.tagText, {color: c.text}]}>{label}</Text>
    </View>
  );
};

const AboutScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Ana Kart */}
      <GlassCard style={styles.mainCard} radius="xxl">
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>AzePSP</Text>
          <View style={styles.flagLine}>
            <View style={[styles.flagDot, {backgroundColor: Colors.azerbaijanBlue}]} />
            <View style={[styles.flagDot, {backgroundColor: Colors.azerbaijanRed}]} />
            <View style={[styles.flagDot, {backgroundColor: Colors.azerbaijanGreen}]} />
          </View>
        </View>
        <Text style={styles.version}>{az.version}</Text>
        <Text style={styles.description}>{az.about.description}</Text>
        <View style={styles.tags}>
          <FeatureTag label="🤖 AI Optimallaşdırma" variant="blue" />
          <FeatureTag label="✨ Glassmorphism UI" />
          <FeatureTag label="🇦🇿 Azərbaycan Mövzusu" variant="green" />
          <FeatureTag label="📊 Gerçek Zamanlı FPS" variant="blue" />
          <FeatureTag label="🎮 PSP Emulatoru" variant="red" />
          <FeatureTag label="🌊 Bayraq Animasiyası" />
        </View>
      </GlassCard>

      {/* Xüsusiyyətlər */}
      <GlassCard style={styles.card} radius="xl">
        <Text style={styles.cardTitle}>{az.about.features}</Text>
        {[
          {icon: '🤖', title: az.about.aiOptimization, desc: 'Cihaz hardware-ına görə avtomatik FPS optimallaşdırması'},
          {icon: '✨', title: az.about.glassmorphism, desc: 'iOS 18/19 stilindəki şəffaf cam effekti'},
          {icon: '🇦🇿', title: az.about.azerbaijanTheme, desc: 'Dalgalı Azərbaycan bayrağı animasiyası'},
          {icon: '📊', title: az.about.realTimeFps, desc: 'FPS, CPU və RAM monitorinqi'},
          {icon: '🎮', title: 'PSP İdarəetmə', desc: 'Şəffaf, parıltılı virtual gamepad'},
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </GlassCard>

      {/* Əsas */}
      <GlassCard style={styles.card} radius="xl">
        <Text style={styles.cardTitle}>{az.about.basedOn}</Text>
        <View style={styles.creditRow}>
          <Text style={styles.creditIcon}>🎮</Text>
          <View>
            <Text style={styles.creditTitle}>{az.about.ppsspp}</Text>
            <Text style={styles.creditDesc}>Henrik Rydgård — GPLv2 Lisenziyası</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.ppsspp.org')}
          style={styles.linkBtn}>
          <Text style={styles.linkText}>ppsspp.org →</Text>
        </TouchableOpacity>
      </GlassCard>

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
  mainCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.base,
    alignItems: 'center',
  },
  logoWrap: {alignItems: 'center', marginBottom: 6},
  logoText: {
    fontSize: 52,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -2,
  },
  flagLine: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  flagDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },
  version: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: Spacing.base,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.base,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  featureIcon: {fontSize: 20},
  featureText: {flex: 1},
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textTertiary,
    lineHeight: 17,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  creditIcon: {fontSize: 24},
  creditTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  creditDesc: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  linkBtn: {
    paddingTop: 4,
  },
  linkText: {
    fontSize: 13,
    color: Colors.azerbaijanBlue,
    fontWeight: '600',
  },
});

export default AboutScreen;
