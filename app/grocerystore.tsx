import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

const API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY;
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

type FoodItem = {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodCategory?: string;
  foodNutrients?: { nutrientName: string; value: number }[];
};

export default function GroceryStore() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { dark } = useTheme();
  const c = dark ? darkColors : lightColors;

  const fetchFoods = async (term: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${BASE_URL}/foods/search?query=${encodeURIComponent(term)}&api_key=${API_KEY}&pageSize=20`
      );
      const data = await res.json();
      setResults(data.foods ?? []);
    } catch {
      setError('Failed to fetch results. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    const term = query.trim();
    fetchFoods(term);
  };

  const getCalories = (item: FoodItem) => {
    const cal = item.foodNutrients?.find((n) => n.nutrientName === 'Energy');
    return cal ? Math.round(cal.value) : null;
  };

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]}>
      <View style={styles.headerBg} />

      <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
        <View style={styles.settingsIcon}>
          <View style={styles.settingsLine} />
          <View style={[styles.settingsLine, { width: 16 }]} />
          <View style={styles.settingsLine} />
        </View>
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <TextInput
          style={[styles.input, { backgroundColor: c.card, color: c.text }]}
          placeholder="Search foods..."
          placeholderTextColor={c.subtext}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={search}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} color="#3163E3" size="large" />}
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.fdcId)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const kcal = getCalories(item);
          return (
            <View style={[styles.foodCard, { backgroundColor: c.card }]}>
              {/* Left thumbnail with calorie overlay */}
              <View style={styles.thumbnail}>
                <LinearGradient
                  colors={['#3163E3', '#547FEF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.thumbnailGradient}
                />
                {kcal !== null && (
                  <Text style={styles.kcalText}>{kcal}</Text>
                )}
                {kcal !== null && (
                  <Text style={styles.kcalLabel}>kcal</Text>
                )}
              </View>
              {/* Right content */}
              <View style={styles.foodInfo}>
                {!!item.foodCategory && (
                  <Text style={styles.foodCategory}>{item.foodCategory}</Text>
                )}
                <Text style={[styles.foodName, { color: c.text }]} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const lightColors = { bg: '#FAFEFC', card: '#FFFFFF', text: '#0A3C48', subtext: '#696969' };
const darkColors  = { bg: '#0D0D0D', card: '#1C1C1E', text: '#FFFFFF',  subtext: '#ABABAB' };

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerBg: { position: 'absolute', width: '100%', height: 160, top: 0, backgroundColor: '#3264E4' },
  settingsBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  settingsIcon: { gap: 4, alignItems: 'center' },
  settingsLine: { width: 20, height: 2, backgroundColor: 'white', borderRadius: 2 },
  searchRow: { flexDirection: 'row', margin: 20, gap: 10, marginTop: 100 },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchBtn: { backgroundColor: '#3163E3', borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center' },
  searchBtnText: { color: 'white', fontWeight: '600', fontSize: 15 },
  loader: { marginTop: 20 },
  error: { textAlign: 'center', color: 'red', marginTop: 12 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  foodCard: {
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    height: 99,
  },
  thumbnail: {
    width: 65,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  kcalText: {
    color: '#FAFEFC',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  kcalLabel: {
    color: '#FAFEFC',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.85,
  },
  foodInfo: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  foodCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3163E3',
    marginBottom: 4,
  },
  foodName: { fontSize: 15, fontWeight: '500', color: '#384144' },
});
