import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Lock, Mail, User, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
        Alert.alert('Error', 'Por favor ingresa todos los campos');
        return;
    }

    setLoading(true);
    try {
        await api.post('/auth/register', { 
            full_name: fullName, 
            email, 
            password 
        });
        
        Alert.alert('Éxito', 'Cuenta creada exitosamente. Por favor inicia sesión.', [
            { text: 'OK', onPress: () => router.replace('/login') }
        ]);
    } catch (err: any) {
        Alert.alert('Error de Registro', err.response?.data?.message || 'No se pudo crear la cuenta');
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
              <View style={styles.logoContainer}>
                  <ShieldCheck color="#fff" size={40} />
              </View>
              <Text style={styles.title}>Crea tu Cuenta</Text>
              <Text style={styles.subtitle}>Únete a la nueva era bancaria</Text>
          </View>

          <View style={styles.form}>
              <View style={styles.inputContainer}>
                  <User color="#94a3b8" size={20} style={styles.inputIcon} />
                  <TextInput 
                      style={styles.input}
                      placeholder="Nombre Completo"
                      placeholderTextColor="#64748b"
                      value={fullName}
                      onChangeText={setFullName}
                  />
              </View>

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

              <TouchableOpacity 
                  style={[styles.registerButton, loading && styles.buttonDisabled]} 
                  onPress={handleRegister}
                  disabled={loading}
              >
                  {loading ? (
                      <ActivityIndicator color="#fff" />
                  ) : (
                      <>
                          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                          <ArrowRight color="#fff" size={20} />
                      </>
                  )}
              </TouchableOpacity>

              <View style={styles.footer}>
                  <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                  <TouchableOpacity onPress={() => router.replace('/login')}>
                      <Text style={styles.signInText}>Inicia Sesión</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 30,
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 5,
  },
  form: {
    gap: 15,
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
  registerButton: {
    backgroundColor: '#6366f1',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
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
  signInText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
