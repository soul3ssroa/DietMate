import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/theme-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const H_PAD = 28;
const GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - H_PAD * 2 - GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.33;

const DIETS = [
  { id: "diabetic",  label: "Diabetic",    sub: "Low sugar",            image: require("@/assets/images/diabetic.png")    },
  { id: "cardiac",   label: "Cardiac",      sub: "Low fats and sodium",  image: require("@/assets/images/cardiac.png")     },
  { id: "gluten",    label: "Gluten-Free",  sub: "Avoid certain grains", image: require("@/assets/images/glutenfree.png")  },
  { id: "lactose",   label: "Lactose-Free", sub: "Avoid most dairy",     image: require("@/assets/images/lactosefree.png") },
  { id: "renal",     label: "Renal",        sub: "Limit certain salts",  image: require("@/assets/images/renal.png")       },
  { id: "highfiber", label: "High Fiber",   sub: "Increase fiber intake", image: require("@/assets/images/highfiber.png")  },
];

export default function DietSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const { dark } = useTheme();
  const c = dark ? darkColors : lightColors;

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]}>
      <View style={styles.headerBg} />
      <Image source={require('@/assets/images/bannergrape.png')} style={styles.bannerImage} resizeMode="contain" />
      <View style={[styles.sheet, { backgroundColor: c.bg }]} />

      <Text style={styles.headerTitle}>Select your Diet</Text>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {DIETS.map((diet) => {
          const isSelected = selected.includes(diet.id);
          return (
            <TouchableOpacity
              key={diet.id}
              style={[styles.card, isSelected && styles.cardSelected, { backgroundColor: c.card }]}
              onPress={() => toggle(diet.id)}
              activeOpacity={0.85}
            >
              <View style={styles.cardBg} />
              <Image source={diet.image} style={styles.cardImage} resizeMode="cover" />
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.16)"]}
                style={styles.cardOverlay}
              />
              <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                {isSelected && <View style={styles.checkInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.finalizeBtnWrapper}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/grocerystore')}>
          <LinearGradient
            colors={["#3163E3", "#3264E4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finalizeBtn}
          >
            <Text style={styles.finalizeBtnText}>Finalize Diet</Text>
            <View style={styles.arrow} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const lightColors = { bg: '#FAFEFC', card: '#FFFFFF' };
const darkColors  = { bg: '#0D0D0D', card: '#1C1C1E' };

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerBg: { position: "absolute", width: "100%", height: 222, top: 0, backgroundColor: "#3264E4" },
  bannerImage: { position: 'absolute', right: -60, top: 20, height: 165, width: 220 },
  sheet: { position: "absolute", width: "100%", height: 771, top: 142, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  headerTitle: { position: "absolute", top: 80, alignSelf: "center", width: 347, textAlign: "center", color: "white", fontSize: 32, fontWeight: "600" },
  scrollArea: { position: "absolute", top: 170, left: H_PAD, right: H_PAD, bottom: 90 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP, paddingBottom: 20 },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 18, backgroundColor: "white", overflow: "hidden" },
  cardSelected: { borderWidth: 3, borderColor: '#3163E3' },
  cardBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F3F5F9", borderRadius: 18 },
  cardImage: { position: "absolute", top: 0, left: 0, width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 18 },
  cardOverlay: { position: "absolute", left: 0, right: 0, top: CARD_HEIGHT * 0.38, height: CARD_HEIGHT * 0.62, borderRadius: 18 },
  checkCircle: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'white', backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
  checkCircleSelected: { backgroundColor: '#3163E3', borderColor: '#3163E3' },
  checkInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'white' },
  finalizeBtnWrapper: { position: "absolute", bottom: 15, left: 47, right: 47 },
  finalizeBtn: { height: 65, borderRadius: 18, justifyContent: "center", paddingLeft: 44 },
  finalizeBtnText: { color: "white", fontSize: 26, fontWeight: "600" },
  arrow: { position: "absolute", right: 28, width: 12, height: 18, borderTopWidth: 2.5, borderRightWidth: 2.5, borderColor: "white", transform: [{ rotate: "45deg" }] },
});
