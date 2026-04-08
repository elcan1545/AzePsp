import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors, BorderRadius} from '../theme/theme';

const GlassCard = ({
  children,
  style,
  strong = false,
  noBorder = false,
  radius = 'lg',
}) => {
  return (
    <View
      style={[
        styles.card,
        strong ? styles.cardStrong : null,
        noBorder ? styles.noBorder : null,
        {borderRadius: BorderRadius[radius] || BorderRadius.lg},
        style,
      ]}>
      <View style={styles.shimmer} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  cardStrong: {
    backgroundColor: Colors.glassStrong,
    borderColor: Colors.glassBorderStrong,
  },
  noBorder: {
    borderWidth: 0,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    pointerEvents: 'none',
  },
});

export default GlassCard;
