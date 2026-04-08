import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Colors, BorderRadius, Typography} from '../theme/theme';

const {height} = Dimensions.get('window');

const MENU_ITEMS = [
  {id: 'home', icon: '⌂', label: 'Ana Səhifə'},
  {id: 'load', icon: '↑', label: 'Oyun Yüklə'},
  {id: 'settings', icon: '⚙', label: 'Ayarlar'},
  {id: 'about', icon: 'ℹ', label: 'Haqqında'},
];

const SideMenu = ({activeScreen, onNavigate}) => {
  return (
    <View style={styles.menu}>
      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>Az</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Menü elementləri */}
      {MENU_ITEMS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, activeScreen === item.id && styles.menuItemActive]}
          onPress={() => onNavigate(item.id)}
          activeOpacity={0.75}>
          <Text style={[styles.menuIcon, activeScreen === item.id && styles.menuIconActive]}>
            {item.icon}
          </Text>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{flex: 1}} />

      {/* Çıxış */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => onNavigate('exit')}
        activeOpacity={0.75}>
        <Text style={styles.menuIcon}>⏻</Text>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>Çıxış</Text>
        </View>
      </TouchableOpacity>

      <View style={{height: 16}} />
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: 66,
    height: height,
    backgroundColor: 'rgba(8, 8, 12, 0.72)',
    borderRightWidth: 1,
    borderRightColor: Colors.glassBorder,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoWrap: {
    marginBottom: 16,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 146, 188, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(0, 146, 188, 0.50)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  divider: {
    width: 36,
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginBottom: 8,
  },
  menuItem: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: Colors.glassStrong,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.azerbaijanBlue,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.50,
    shadowRadius: 14,
    elevation: 8,
  },
  menuIcon: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.50)',
  },
  menuIconActive: {
    color: Colors.text,
  },
  tooltip: {
    display: 'none',
  },
  tooltipText: {
    fontSize: 11,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text,
  },
});

export default SideMenu;
