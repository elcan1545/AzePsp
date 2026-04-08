import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import {Colors, BorderRadius, Typography} from '../theme/theme';

const GlassButton = ({
  label,
  onPress,
  icon,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.94,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.timing(opacity, {
        toValue: 0.78,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const variantStyle = {
    default: {
      bg: Colors.glass,
      border: Colors.glassBorder,
      glow: null,
    },
    primary: {
      bg: 'rgba(0, 146, 188, 0.20)',
      border: 'rgba(0, 146, 188, 0.55)',
      glow: 'rgba(0, 146, 188, 0.30)',
    },
    danger: {
      bg: 'rgba(239, 51, 64, 0.18)',
      border: 'rgba(239, 51, 64, 0.50)',
      glow: 'rgba(239, 51, 64, 0.25)',
    },
    success: {
      bg: 'rgba(80, 158, 47, 0.18)',
      border: 'rgba(80, 158, 47, 0.50)',
      glow: null,
    },
  };

  const sizeStyle = {
    sm: {paddingH: 16, paddingV: 9, fontSize: Typography.sizes.sm},
    md: {paddingH: 22, paddingV: 13, fontSize: Typography.sizes.md},
    lg: {paddingH: 28, paddingV: 16, fontSize: Typography.sizes.base},
  };

  const v = variantStyle[variant] || variantStyle.default;
  const s = sizeStyle[size] || sizeStyle.md;

  return (
    <Animated.View
      style={[
        {transform: [{scale}], opacity},
        v.glow && {
          shadowColor: v.glow,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.8,
          shadowRadius: 16,
          elevation: 8,
        },
        style,
      ]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={[
          styles.button,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
            paddingHorizontal: s.paddingH,
            paddingVertical: s.paddingV,
            borderRadius: BorderRadius.md,
            opacity: disabled ? 0.5 : 1,
          },
        ]}>
        <View style={styles.shimmer} />
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text
          style={[
            styles.label,
            {fontSize: s.fontSize},
            textStyle,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  iconWrap: {
    marginRight: 8,
  },
  label: {
    color: Colors.text,
    fontWeight: Typography.weights.semiBold,
    letterSpacing: 0.2,
  },
});

export default GlassButton;
