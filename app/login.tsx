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
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function Login() {
  const router = useRouter();
  const { dark } = useTheme();
  const c = dark ? darkColors : lightColors;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/selection');
    } catch (e: any) {
      Alert.alert('Sign In Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!email.trim() || !password.trim()) return;
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
      {/* Header */}
      <LinearGradient colors={['#3163E3', '#3264E4']} style={styles.header}>
        <Text style={styles.appName}>DietMate</Text>
        <Text style={styles.tagline}>Your personalized diet companion</Text>
      </LinearGradient>

      {/* Card */}
      <View style={[styles.card, { backgroundColor: c.card }]}>
        <Text style={[styles.title, { color: c.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: c.subtext }]}>Sign in to continue</Text>

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

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={signIn} disabled={loading} activeOpacity={0.9}>
          <LinearGradient
            colors={['#3163E3', '#3264E4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginBtn}
          >
            <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={[styles.signupText, { color: c.subtext }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/createaccount')}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
    height: 260,
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
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -8 },
  forgotText: { color: '#3163E3', fontSize: 13, fontWeight: '600' },
  loginBtn: { height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  loginBtnText: { color: 'white', fontSize: 17, fontWeight: '700' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signupText: { fontSize: 14 },
  signupLink: { fontSize: 14, color: '#3163E3', fontWeight: '700' },
});
