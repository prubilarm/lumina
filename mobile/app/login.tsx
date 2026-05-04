import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Dimensions, Animated } from 'react-native';
import { Lock, Mail, ShieldCheck, ArrowRight, Zap, Eye, EyeOff } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Protocolo de Seguridad', 'Por favor ingrese sus credenciales completas para autorizar el acceso.');
        return;
    }

    setLoading(true);
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token } = response.data;
        setAuthToken(token);
        router.replace('/(tabs)');
    } catch (err: any) {
        Alert.alert('Acceso Denegado', err.response?.data?.message || 'Las credenciales proporcionadas no coinciden con nuestros registros de seguridad.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#020408', '#0f172a', '#05070A']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative Orbs */}
      <View style={[styles.orb, { top: -100, right: -100, backgroundColor: 'rgba(99, 102, 241, 0.15)' }]} />
      <View style={[styles.orb, { bottom: -150, left: -100, backgroundColor: 'rgba(34, 211, 238, 0.1)' }]} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoWrapper}>
                <LinearGradient
                    colors={['#6366f1', '#4f46e5']}
                    style={styles.logoContainer}
                >
                    <Zap color="#fff" size={32} fill="currentColor" />
                </LinearGradient>
                <View style={styles.logoRing} />
              </View>
              <Text style={styles.brandTitle}>LUMINA</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.subtitle}>SISTEMA DE BANCA PRIVADA</Text>
              </View>
          </Animated.View>

          <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.inputGroup}>
                  <Text style={styles.label}>Credenciales de Auditoría</Text>
                  
                  <View style={styles.glassInputWrapper}>
                      <View style={styles.inputIconWrapper}>
                        <Mail color="#6366f1" size={20} />
                      </View>
                      <TextInput 
                          style={styles.input}
                          placeholder="ID de Usuario / Email"
                          placeholderTextColor="#475569"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                      />
                  </View>

                  <View style={styles.glassInputWrapper}>
                      <View style={styles.inputIconWrapper}>
                        <Lock color="#6366f1" size={20} />
                      </View>
                      <TextInput 
                          style={styles.input}
                          placeholder="Clave de Acceso Secreta"
                          placeholderTextColor="#475569"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeBtn}
                      >
                        {showPassword ? <EyeOff color="#475569" size={20} /> : <Eye color="#475569" size={20} />}
                      </TouchableOpacity>
                  </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Recuperar Clave de Acceso</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                  style={[styles.loginButton, (loading || !email || !password) && styles.loginButtonDisabled]} 
                  onPress={handleLogin}
                  disabled={loading || !email || !password}
              >
                  <LinearGradient
                    colors={['#6366f1', '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
                  />
                  {loading ? (
                      <ActivityIndicator color="#fff" />
                  ) : (
                      <>
                          <Text style={styles.loginButtonText}>Autorizar Acceso</Text>
                          <ArrowRight color="#fff" size={18} strokeWidth={3} />
                      </>
                  )}
              </TouchableOpacity>

              <View style={styles.footer}>
                  <Text style={styles.footerText}>¿No posee credenciales? </Text>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                      <Text style={styles.signUpText}>Solicitar Apertura</Text>
                  </TouchableOpacity>
              </View>
          </Animated.View>

          <View style={styles.securitySection}>
              <View style={styles.divider} />
              <View style={styles.securityBadge}>
                  <ShieldCheck color="#22d3ee" size={14} />
                  <Text style={styles.securityText}>
                      LUMINA SECURE PROTOCOL • ENCRIPTACIÓN AES-512
                  </Text>
              </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    zIndex: 1,
  },
  brandTitle: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 16,
  },
  label: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
    marginLeft: 4,
  },
  glassInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 22,
    height: 68,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 4,
  },
  inputIconWrapper: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  eyeBtn: {
    padding: 15,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginButton: {
    height: 68,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 15,
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signUpText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  securitySection: {
    marginTop: 50,
    alignItems: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.6,
  },
  securityText: {
    color: '#475569',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
