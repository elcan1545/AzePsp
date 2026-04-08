import React, {useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {Colors, BorderRadius, Typography} from '../theme/theme';

const {width, height} = Dimensions.get('window');

const ControlBtn = ({label, color, onPress, style}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const onIn = () => {
    Animated.parallel([
      Animated.spring(scale, {toValue: 0.88, useNativeDriver: true, speed: 60}),
      Animated.timing(opacity, {toValue: 0.70, duration: 60, useNativeDriver: true}),
    ]).start();
  };

  const onOut = () => {
    Animated.parallel([
      Animated.spring(scale, {toValue: 1, useNativeDriver: true, speed: 30, bounciness: 12}),
      Animated.timing(opacity, {toValue: 1, duration: 120, useNativeDriver: true}),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        {transform: [{scale}], opacity},
        style,
        color && {
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.70,
          shadowRadius: 12,
          elevation: 6,
        },
      ]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        activeOpacity={1}
        style={[
          styles.faceBtn,
          color && {borderColor: color + '70'},
        ]}>
        <Text style={[styles.faceBtnText, color && {color}]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const DpadBtn = ({label, onPress, style}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onIn = () => Animated.spring(scale, {toValue: 0.90, useNativeDriver: true, speed: 60}).start();
  const onOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, speed: 30, bounciness: 10}).start();

  return (
    <Animated.View style={[{transform: [{scale}]}, style]}>
      <TouchableOpacity
        onPressIn={onIn}
        onPressOut={onOut}
        onPress={onPress}
        activeOpacity={0.75}
        style={styles.dpadBtn}>
        <Text style={styles.dpadText}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const GameController = ({onHome}) => {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Tetiklər */}
      <View style={styles.triggers}>
        <TouchableOpacity style={styles.trigger}>
          <Text style={styles.triggerText}>L</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.trigger}>
          <Text style={styles.triggerText}>R</Text>
        </TouchableOpacity>
      </View>

      {/* Sol - D-Pad */}
      <View style={styles.dpad}>
        <View style={styles.dpadRow}>
          <DpadBtn label="▲" style={styles.dpadUp} />
        </View>
        <View style={[styles.dpadRow, {justifyContent: 'space-between'}]}>
          <DpadBtn label="◄" style={styles.dpadSide} />
          <View style={styles.dpadCenter} />
          <DpadBtn label="►" style={styles.dpadSide} />
        </View>
        <View style={styles.dpadRow}>
          <DpadBtn label="▼" style={styles.dpadDown} />
        </View>
      </View>

      {/* Sağ - Üz Butonları */}
      <View style={styles.faceButtons}>
        <View style={styles.faceRow}>
          <ControlBtn label="△" color="#4ade80" />
        </View>
        <View style={[styles.faceRow, {justifyContent: 'space-between', width: 110}]}>
          <ControlBtn label="□" color="#f472b6" />
          <ControlBtn label="○" color="#f87171" />
        </View>
        <View style={styles.faceRow}>
          <ControlBtn label="✕" color="#60a5fa" />
        </View>
      </View>

      {/* Merkez Butonlar */}
      <View style={styles.centerButtons}>
        <TouchableOpacity style={styles.centerBtn}>
          <Text style={styles.centerBtnText}>SELECT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerBtn} onPress={onHome}>
          <Text style={styles.centerBtnText}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerBtn}>
          <Text style={styles.centerBtnText}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  triggers: {
    position: 'absolute',
    top: 160,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  trigger: {
    width: 72,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1,
  },
  dpad: {
    position: 'absolute',
    bottom: 90,
    left: 28,
    alignItems: 'center',
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  dpadBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadUp:    {borderRadius: 8, borderBottomWidth: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
  dpadDown:  {borderRadius: 8, borderTopWidth: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0},
  dpadSide:  {},
  dpadCenter: {width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)'},
  dpadText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '500',
  },
  faceButtons: {
    position: 'absolute',
    bottom: 90,
    right: 28,
    alignItems: 'center',
    gap: 4,
  },
  faceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    height: 44,
  },
  faceBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.80)',
  },
  centerButtons: {
    position: 'absolute',
    bottom: 126,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  centerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  centerBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 0.8,
  },
});

export default GameController;
