import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Por favor ingresa todos los campos');
        return;
    }

    setLoading(true);
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
        // Save token and navigate
        setAuthToken(token);
        // In a real app, use SecureStore to persist token
        
        router.replace('/(tabs)');
    } catch (err: any) {
        Alert.alert('Error de Inicio de Sesión', err.response?.data?.message || 'Credenciales inválidas');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <ShieldCheck color="#fff" size={40} />
            </View>
            <Text style={styles.title}>Sentendar</Text>
            <Text style={styles.subtitle}>Banca Móvil Segura</Text>
        </View>

        <View style={styles.form}>
            <View style={styles.inputContainer}>
                <Mail color="#94a3b8" size={20} style={styles.inputIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Lock color="#94a3b8" size={20} style={styles.inputIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                        <ArrowRight color="#fff" size={20} />
                    </>
                )}
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.signUpText}>Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>

        <Text style={styles.securityText}>
            Protegido con cifrado de extremo a extremo
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#6366f1',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 5,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#6366f1',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 14,
  },
  signUpText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  securityText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    marginTop: 40,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
