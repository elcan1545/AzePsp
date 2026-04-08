import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Typography, BorderRadius} from '../theme/theme';

const InfoPanel = () => {
  const [fps, setFps] = useState(60);
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(312);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(prev => Math.round(Math.max(45, Math.min(60, prev + (Math.random() - 0.5) * 4))));
      setCpu(prev => Math.round(Math.max(10, Math.min(70, prev + (Math.random() - 0.5) * 8))));
      setRam(prev => Math.round(Math.max(260, Math.min(480, prev + (Math.random() - 0.5) * 20))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fpsColor =
    fps >= 55 ? '#4ade80' : fps >= 40 ? '#fbbf24' : '#f87171';
  const cpuColor =
    cpu < 40 ? '#4ade80' : cpu < 65 ? '#fbbf24' : '#f87171';

  return (
    <View style={styles.panel}>
      <View style={styles.item}>
        <Text style={styles.label}>FPS</Text>
        <Text style={[styles.value, {color: fpsColor}]}>{fps}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>CPU</Text>
        <Text style={[styles.value, {color: cpuColor}]}>{cpu}%</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>RAM</Text>
        <Text style={styles.value}>{ram}MB</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>AzePSP v1.0 · AI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 100,
    backgroundColor: 'rgba(10, 10, 10, 0.62)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 12,
  },
  item: {
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 8,
    fontWeight: Typography.weights.bold,
    color: 'rgba(255,255,255,0.42)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 14,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 26,
    backgroundColor: Colors.glassBorder,
  },
  badge: {
    backgroundColor: 'rgba(0, 146, 188, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0, 146, 188, 0.38)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Colors.azerbaijanBlue,
    letterSpacing: 0.3,
  },
});

export default InfoPanel;
