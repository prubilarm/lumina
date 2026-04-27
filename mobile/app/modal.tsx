import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Send, User, ShieldCheck, X, ArrowRight } from 'lucide-react-native';
import api from '../services/api';

export default function TransferScreen() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [amount, setAmount] = useState('');
    const [receiver, setReceiver] = useState('');
    const [description, setDescription] = useState('');
    const [transferType, setTransferType] = useState('third-party'); // 'own' or 'third-party'
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/user/balance');
            setAccounts(res.data);
            setFetching(false);
        } catch (err) {
            console.error(err);
            setFetching(false);
        }
    };

    const handleTransfer = async () => {
        if (!amount || !receiver) {
            Alert.alert('Error', 'Por favor completa los campos obligatorios');
            return;
        }

        setLoading(true);
        try {
            await api.post('/transactions/transfer', {
                amount: parseFloat(amount),
                receiver_account_number: receiver,
                description: description || (transferType === 'own' ? 'Transferencia entre cuentas' : 'Transferencia a terceros')
            });
            Alert.alert('Éxito', 'Transferencia realizada con éxito', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Error al procesar la transferencia');
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
                <Text style={styles.title}>Nueva Transferencia</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X color="#94a3b8" size={24} />
                </TouchableOpacity>
            </View>

            {/* Type Selector */}
            <View style={styles.typeSelector}>
                <TouchableOpacity 
                    style={[styles.typeBtn, transferType === 'own' && styles.typeBtnActive]}
                    onPress={() => setTransferType('own')}
                >
                    <ShieldCheck color={transferType === 'own' ? '#fff' : '#94a3b8'} size={18} />
                    <Text style={[styles.typeText, transferType === 'own' && styles.typeTextActive]}>Cuenta Propia</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.typeBtn, transferType === 'third-party' && styles.typeBtnActive]}
                    onPress={() => {
                        setTransferType('third-party');
                        setReceiver('');
                    }}
                >
                    <User color={transferType === 'third-party' ? '#fff' : '#94a3b8'} size={18} />
                    <Text style={[styles.typeText, transferType === 'third-party' && styles.typeTextActive]}>Terceros</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>{transferType === 'own' ? 'Seleccionar Cuenta' : 'Cuenta de Destino'}</Text>
                {transferType === 'own' ? (
                    <View style={styles.accountsGrid}>
                        {accounts.map((acc, i) => (
                            <TouchableOpacity 
                                key={i} 
                                style={[styles.accCard, receiver === acc.account_number && styles.accCardActive]}
                                onPress={() => setReceiver(acc.account_number)}
                            >
                                <Text style={styles.accName}>{acc.account_number.startsWith('SAV') ? 'Ahorros' : 'Corriente'}</Text>
                                <Text style={styles.accNum}>{acc.account_number}</Text>
                                <Text style={styles.accBal}>${parseFloat(acc.balance).toLocaleString()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Número de cuenta (Ej: SAV-123)"
                            placeholderTextColor="#475569"
                            value={receiver}
                            onChangeText={setReceiver}
                        />
                    </View>
                )}

                <Text style={styles.label}>Monto (USD)</Text>
                <View style={styles.amountContainer}>
                    <Text style={styles.currencyIcon}>$</Text>
                    <TextInput 
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#1e293b"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Concepto</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Descripción opcional"
                        placeholderTextColor="#475569"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                    onPress={handleTransfer}
                    disabled={loading || !amount || !receiver}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.submitBtnText}>Confirmar Transferencia</Text>
                            <ArrowRight color="#fff" size={20} />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
    },
    typeSelector: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 6,
        marginBottom: 30,
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
    },
    typeBtnActive: {
        backgroundColor: '#6366f1',
    },
    typeText: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: 'bold',
    },
    typeTextActive: {
        color: '#fff',
    },
    form: {
        gap: 10,
    },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    inputContainer: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 60,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        color: '#fff',
        fontSize: 16,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    currencyIcon: {
        fontSize: 34,
        color: '#6366f1',
        fontWeight: '900',
        marginRight: 10,
    },
    amountInput: {
        flex: 1,
        color: '#fff',
        fontSize: 40,
        fontWeight: '900',
    },
    accountsGrid: {
        flexDirection: 'row',
        gap: 12,
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
        color: '#6366f1',
        fontSize: 10,
        fontWeight: 'bold',
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
    submitBtn: {
        backgroundColor: '#6366f1',
        height: 65,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 40,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
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
