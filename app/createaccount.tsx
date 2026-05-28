import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/theme-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function CreateAccount() {
  const router = useRouter();
  const { dark } = useTheme();
  const c = dark ? darkColors : lightColors;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!email.trim() || !password.trim() || !confirm.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/selection');
    } catch (e: any) {
      Alert.alert('Sign Up Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: c.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient colors={['#3163E3', '#3264E4']} style={styles.header}>
        <Text style={styles.appName}>DietMate</Text>
        <Text style={styles.tagline}>Create your account</Text>
      </LinearGradient>

      <View style={[styles.card, { backgroundColor: c.card }]}>
        <Text style={[styles.title, { color: c.text }]}>Get started</Text>
        <Text style={[styles.subtitle, { color: c.subtext }]}>Sign up to begin your diet journey</Text>

        <Text style={[styles.label, { color: c.subtext }]}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: c.inputBg, color: c.text, borderColor: c.border }]}
          placeholder="you@example.com"
          placeholderTextColor={c.subtext}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: c.subtext }]}>Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: c.inputBg, color: c.text, borderColor: c.border }]}
          placeholder="••••••••"
          placeholderTextColor={c.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={[styles.label, { color: c.subtext }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: c.inputBg, color: c.text, borderColor: c.border }]}
          placeholder="••••••••"
          placeholderTextColor={c.subtext}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleCreate} disabled={loading} activeOpacity={0.9}>
          <LinearGradient
            colors={['#3163E3', '#3264E4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: c.subtext }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const lightColors = {
  bg: '#F0F4FF',
  card: '#FFFFFF',
  text: '#0A3C48',
  subtext: '#696969',
  inputBg: '#F3F5F9',
  border: '#E2E2E2',
};

const darkColors = {
  bg: '#0D0D0D',
  card: '#1C1C1E',
  text: '#FFFFFF',
  subtext: '#ABABAB',
  inputBg: '#2C2C2E',
  border: '#3A3A3C',
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    height: 220,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  appName: { color: 'white', fontSize: 38, fontWeight: '700', letterSpacing: 1 },
  tagline: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 },
  card: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  btn: { height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  btnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, color: '#3163E3', fontWeight: '700' },
});
