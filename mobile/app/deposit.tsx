import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ArrowLeft, Landmark, CreditCard } from 'lucide-react-native';
import api from '../services/api';

export default function DepositScreen() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [amount, setAmount] = useState('');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/user/balance');
            setAccounts(res.data);
            if (res.data.length > 0) setSelectedAccount(res.data[0].account_number);
            setFetching(false);
        } catch (err) {
            console.error(err);
            setFetching(false);
        }
    };

    const handleDeposit = async () => {
        if (!amount || !selectedAccount) {
            Alert.alert('Error', 'Por favor ingresa un monto');
            return;
        }

        setLoading(true);
        try {
            // In a real banking app, this would involve a gateway or check scan
            // For Sentendar, we'll use a simulation endpoint or transfer to self
            await api.post('/transactions/transfer', {
                amount: parseFloat(amount),
                receiver_account_number: selectedAccount,
                description: 'Depósito en Cajero Automático'
            });
            Alert.alert('Éxito', 'Depósito procesado correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Error al procesar el depósito');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Depositar Fondos</Text>
            </View>

            <View style={styles.illustration}>
                <View style={styles.iconCircle}>
                    <Landmark color="#6366f1" size={40} />
                </View>
                <Text style={styles.subtitle}>Selecciona la cuenta de destino</Text>
            </View>

            <View style={styles.formSplit}>
                {accounts.map((acc, i) => (
                    <TouchableOpacity 
                        key={i} 
                        style={[styles.accCard, selectedAccount === acc.account_number && styles.accCardActive]}
                        onPress={() => setSelectedAccount(acc.account_number)}
                    >
                        <CreditCard color={selectedAccount === acc.account_number ? '#fff' : '#6366f1'} size={20} />
                        <Text style={styles.accName}>{acc.account_number.startsWith('SAV') ? 'Ahorros' : 'Corriente'}</Text>
                        <Text style={styles.accNum}>{acc.account_number}</Text>
                        <Text style={styles.accBal}>${parseFloat(acc.balance).toLocaleString()}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.inputSection}>
                <Text style={styles.label}>Monto a depositar</Text>
                <View style={styles.amountInputContainer}>
                    <Text style={styles.currency}>$</Text>
                    <TextInput 
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#475569"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        autoFocus
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                    onPress={handleDeposit}
                    disabled={loading || !amount}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Plus color="#fff" size={24} />
                            <Text style={styles.submitBtnText}>Realizar Depósito</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    centered: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 40,
        marginTop: 10,
    },
    backButton: {
        padding: 8,
        backgroundColor: '#1e293b',
        borderRadius: 12,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    illustration: {
        alignItems: 'center',
        marginBottom: 30,
    },
    iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(99,102,241,0.1)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 16,
    },
    formSplit: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 40,
    },
    accCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    accCardActive: {
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
    },
    accName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
    },
    accNum: {
        color: '#94a3b8',
        fontSize: 10,
        marginVertical: 4,
    },
    accBal: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputSection: {
        backgroundColor: '#1e293b',
        padding: 24,
        borderRadius: 24,
        gap: 16,
    },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#6366f1',
        paddingBottom: 8,
    },
    currency: {
        fontSize: 32,
        color: '#6366f1',
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    submitBtn: {
        backgroundColor: '#6366f1',
        height: 60,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    submitBtnDisabled: {
        opacity: 0.5,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
