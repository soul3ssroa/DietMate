import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/context/theme-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function Settings() {
  const router = useRouter();
  const { dark, toggleDark } = useTheme();
  const c = dark ? darkColors : lightColors;

  const [notifications, setNotifications] = useState(true);

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]}>
      <View style={styles.headerBg} />

      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <View style={styles.backArrow} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Settings</Text>

      <View style={[styles.section, { backgroundColor: c.card }]}>
        <Text style={[styles.sectionLabel, { color: c.subtext }]}>PREFERENCES</Text>

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: c.text }]}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E2E2E2', true: '#3163E3' }}
            thumbColor="white"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: c.divider }]} />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: c.text }]}>Dark Mode</Text>
          <Switch
            value={dark}
            onValueChange={toggleDark}
            trackColor={{ false: '#E2E2E2', true: '#3163E3' }}
            thumbColor="white"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: c.card }]}>
        <Text style={[styles.sectionLabel, { color: c.subtext }]}>DIET</Text>

        <TouchableOpacity style={styles.row} onPress={() => router.push('/selection')}>
          <Text style={[styles.rowLabel, { color: c.text }]}>Change Diet Plan</Text>
          <View style={[styles.chevron, { borderColor: c.subtext }]} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: c.card }]}>
        <Text style={[styles.sectionLabel, { color: c.subtext }]}>ACCOUNT</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={[styles.rowLabel, { color: c.text }]}>Profile</Text>
          <View style={[styles.chevron, { borderColor: c.subtext }]} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: c.divider }]} />

        <TouchableOpacity style={styles.row} onPress={async () => { await signOut(auth); router.replace('/login'); }}>
          <Text style={[styles.rowLabel, { color: '#E03E3E' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const lightColors = {
  bg: '#FAFEFC',
  card: '#FFFFFF',
  text: '#0A3C48',
  subtext: '#999',
  divider: '#F0F0F0',
};

const darkColors = {
  bg: '#0D0D0D',
  card: '#1C1C1E',
  text: '#FFFFFF',
  subtext: '#ABABAB',
  divider: '#2C2C2E',
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerBg: { position: 'absolute', width: '100%', height: 160, top: 0, backgroundColor: '#3264E4' },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: 'white',
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  headerTitle: { marginTop: 60, textAlign: 'center', color: 'white', fontSize: 28, fontWeight: '600' },
  section: {
    marginTop: 80,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, paddingTop: 14, paddingBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  divider: { height: 1 },
  chevron: { width: 8, height: 8, borderTopWidth: 2, borderRightWidth: 2, transform: [{ rotate: '45deg' }] },
});
