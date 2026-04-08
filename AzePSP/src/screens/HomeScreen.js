import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {Colors, BorderRadius, Typography, Spacing} from '../theme/theme';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import az from '../i18n/az';

const {width} = Dimensions.get('window');

const DEMO_GAMES = [
  {id: 1, name: 'God of War: Chains of Olympus', emoji: '⚔️', size: '700MB'},
  {id: 2, name: 'Monster Hunter Freedom Unite', emoji: '🗡️', size: '1.2GB'},
  {id: 3, name: 'GTA: Vice City Stories', emoji: '🚗', size: '890MB'},
  {id: 4, name: 'Tekken: Dark Resurrection', emoji: '🥊', size: '380MB'},
  {id: 5, name: "Final Fantasy VII: Crisis Core", emoji: '⚡', size: '1.5GB'},
  {id: 6, name: 'Daxter', emoji: '🦊', size: '510MB'},
];

const GameCard = ({game, onPress}) => (
  <TouchableOpacity onPress={() => onPress(game)} activeOpacity={0.82}>
    <GlassCard style={styles.gameCard} radius="xl">
      <View style={styles.gameIconWrap}>
        <Text style={styles.gameIcon}>{game.emoji}</Text>
      </View>
      <Text style={styles.gameTitle} numberOfLines={2}>{game.name}</Text>
      <Text style={styles.gameSize}>{game.size}</Text>
    </GlassCard>
  </TouchableOpacity>
);

const HomeScreen = ({onLaunchGame, onLoadGame}) => {
  const [games] = useState(DEMO_GAMES);

  const handleLoadGame = () => {
    Alert.alert(
      'Oyun Yüklə',
      'ISO/CSO faylını seçin.\n\n(Android-də fayl seçici açılacaq)',
      [
        {text: 'Ləğv et', style: 'cancel'},
        {text: 'Fayl Seç', onPress: onLoadGame},
      ],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>

      {/* Başlıq */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>AzePSP</Text>
        <View style={styles.flagBadge}>
          <View style={styles.flagMini}>
            <View style={[styles.flagStripe, {backgroundColor: Colors.azerbaijanBlue}]} />
            <View style={[styles.flagStripe, {backgroundColor: Colors.azerbaijanRed}]} />
            <View style={[styles.flagStripe, {backgroundColor: Colors.azerbaijanGreen}]} />
          </View>
          <Text style={styles.subtitle}>{az.appSubtitle}</Text>
        </View>
      </View>

      {/* Hərəkətlər */}
      <View style={styles.actions}>
        <GlassButton
          label={az.menu.loadGame}
          variant="primary"
          size="lg"
          onPress={handleLoadGame}
          style={styles.mainBtn}
        />
        <GlassButton
          label={az.menu.settings}
          size="lg"
          onPress={() => {}}
          style={styles.mainBtn}
        />
      </View>

      {/* Son Oyunlar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{az.menu.recentGames}</Text>
        <View style={styles.gamesGrid}>
          {games.map(game => (
            <GameCard key={game.id} game={game} onPress={onLaunchGame} />
          ))}
        </View>
      </View>

    </ScrollView>
  );
};

const cardWidth = (width - 66 - Spacing.base * 2 - Spacing.sm) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 70,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appTitle: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1.5,
    marginBottom: 6,
  },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagMini: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagStripe: {
    width: 18,
    height: 12,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    letterSpacing: 0.4,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    justifyContent: 'center',
  },
  mainBtn: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gameCard: {
    width: cardWidth,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gameIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 146, 188, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIcon: {
    fontSize: 30,
  },
  gameTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 15,
  },
  gameSize: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
});

export default HomeScreen;
