import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Landmark, ArrowRight, RefreshCw, LogIn } from 'lucide-react-native';
import api, { setAuthToken } from '../../services/api';

export default function TransferScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('juan@example.com');
  const [password, setPassword] = useState('password123');
  const [account, setAccount] = useState(null);
  const [targetAccount, setTargetAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuthToken(data.token);
      setIsLoggedIn(true);
      fetchAccount();
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccount = async () => {
    try {
      const { data } = await api.get('/accounts/me');
      setAccount(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    if (!targetAccount || !amount) {
      return Alert.alert('Error', 'Complete todos los campos');
    }
    setLoading(true);
    try {
      await api.post('/transactions/transfer', {
        fromAccountId: account.id,
        toAccountNumber: targetAccount,
        amount: parseFloat(amount)
      });
      Alert.alert('Éxito', 'Transferencia realizada correctamente');
      setTargetAccount('');
      setAmount('');
      fetchAccount();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error en la transferencia');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Landmark size={48} color="#1e3a8a" />
          <Text style={styles.title}>ATM Mobile</Text>
          <Text style={styles.subtitle}>Inicia sesión para transferir</Text>
        </View>

        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Contraseña" 
            value={password} 
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <>
                <LogIn size={20} color="#fff" />
                <Text style={styles.buttonText}>Entrar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Disponible</Text>
        <Text style={styles.balanceValue}>
          ${account ? parseFloat(account.balance).toLocaleString() : '---'}
        </Text>
        <Text style={styles.accNumber}>Cuenta: {account?.account_number}</Text>
      </View>

      <Text style={styles.sectionTitle}>Nueva Transferencia</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>N° de Cuenta Destino</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej: 1000000002" 
          value={targetAccount} 
          onChangeText={setTargetAccount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Monto a Enviar</Text>
        <TextInput 
          style={styles.input} 
          placeholder="0.00" 
          value={amount} 
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={[styles.button, styles.transferBtn]} onPress={handleTransfer} disabled={loading}>
          <RefreshCw size={20} color="#fff" />
          <Text style={styles.buttonText}>Confirmar Envío</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: {
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e3a8a',
    marginTop: 12,
  },
  subtitle: {
    color: '#64748b',
    marginTop: 8,
  },
  balanceCard: {
    backgroundColor: '#1e3a8a',
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
    marginTop: 40,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 8,
  },
  accNumber: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  transferBtn: {
    marginTop: 8,
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
