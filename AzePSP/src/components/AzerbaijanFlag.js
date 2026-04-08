import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const AzerbaijanFlag = () => {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (anim, duration, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      );

    Animated.parallel([
      animate(wave1, 5000, 0),
      animate(wave2, 6500, 800),
      animate(wave3, 8000, 1600),
    ]).start();
  }, []);

  const translateBlue = wave1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });
  const translateRed = wave2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });
  const translateGreen = wave3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 14],
  });

  const scaleBlue = wave1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.04, 1],
  });
  const scaleRed = wave2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1],
  });
  const scaleGreen = wave3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.03, 1],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Göy zolaq */}
      <Animated.View
        style={[
          styles.stripe,
          styles.blue,
          {transform: [{translateX: translateBlue}, {scaleY: scaleBlue}]},
        ]}
      />
      {/* Qırmızı zolaq */}
      <Animated.View
        style={[
          styles.stripe,
          styles.red,
          {transform: [{translateX: translateRed}, {scaleY: scaleRed}]},
        ]}
      />
      {/* Yaşıl zolaq */}
      <Animated.View
        style={[
          styles.stripe,
          styles.green,
          {transform: [{translateX: translateGreen}, {scaleY: scaleGreen}]},
        ]}
      />

      {/* Parıltı effektləri */}
      <View style={styles.glowBlue} />
      <View style={styles.glowRed} />
      <View style={styles.glowGreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  stripe: {
    position: 'absolute',
    width: width * 1.4,
    left: -(width * 0.2),
  },
  blue: {
    top: 0,
    height: height / 3,
    backgroundColor: 'rgba(0, 146, 188, 0.14)',
  },
  red: {
    top: height / 3,
    height: height / 3,
    backgroundColor: 'rgba(239, 51, 64, 0.12)',
  },
  green: {
    top: (height / 3) * 2,
    height: height / 3,
    backgroundColor: 'rgba(80, 158, 47, 0.10)',
  },
  glowBlue: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(0, 146, 188, 0.08)',
    top: -150,
    left: width * 0.1,
  },
  glowRed: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(239, 51, 64, 0.07)',
    top: height * 0.2,
    right: -100,
  },
  glowGreen: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(80, 158, 47, 0.06)',
    bottom: -200,
    left: width * 0.2,
  },
});

export default AzerbaijanFlag;
