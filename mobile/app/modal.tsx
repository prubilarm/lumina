import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Send, User, ShieldCheck, X, ArrowRight, CreditCard, Wallet } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function TransferScreen() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
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
            if (res.data.length > 0) {
                setSelectedSender(res.data[0].account_number);
            }
            setFetching(false);
        } catch (err) {
            console.error(err);
            setFetching(false);
        }
    };

    const handleTransfer = async () => {
        if (!amount || !receiver || !selectedSender) {
            Alert.alert('Error', 'Por favor completa los campos obligatorios');
            return;
        }

        setLoading(true);
        try {
            if (transferType === 'interbank') {
                // External Interbank Transfer to Aerum
                const response = await fetch('https://banco-aerum.vercel.app/api/interbank/receive', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        account_number: receiver,
                        amount: parseFloat(amount),
                        from_bank: 'Lumina Bank',
                        description: description || 'Transferencia Interbancaria',
                        api_key: 'AERUM-BRIDGE-2026'
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Record the transaction in our backend too (optional, but good for history)
                    try {
                        await api.post('/transactions/transfer', {
                            amount: parseFloat(amount),
                            sender_account_number: selectedSender,
                            receiver_account_number: `AERUM-${receiver}`, // Tagged for history
                            description: `[INTERBANK] ${description || 'Transferencia a Banco Aerum'}`
                        });
                    } catch (e) {
                        console.log('Failed to log interbank tx locally, but external succeeded');
                    }

                    Alert.alert('Éxito Interbancario', 'Transferencia enviada a Banco Aerum con éxito', [
                        { text: 'OK', onPress: () => router.back() }
                    ]);
                } else {
                    throw new Error(data.message || 'El Banco Aerum rechazó la transacción');
                }
            } else {
                // Internal Transfer
                await api.post('/transactions/transfer', {
                    amount: parseFloat(amount),
                    sender_account_number: selectedSender,
                    receiver_account_number: receiver,
                    description: description || (transferType === 'own' ? 'Transferencia entre cuentas' : 'Transferencia a terceros')
                });
                Alert.alert('Éxito', 'Transferencia realizada con éxito', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        } catch (err: any) {
            Alert.alert('Error de Protocolo', err.message || err.response?.data?.message || 'Error al procesar la transferencia');
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
        <View style={styles.container}>
            <LinearGradient
                colors={['#020408', '#05070A']}
                style={StyleSheet.absoluteFill}
            />
            
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.brandTag}>LUMINA TRANSFER</Text>
                        <Text style={styles.title}>Nueva Transferencia</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <X color="#94a3b8" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Sender Account Selector */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Cuenta de Origen</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScroll}
                    >
                        {accounts.map((acc) => (
                            <TouchableOpacity 
                                key={acc.account_number}
                                style={[
                                    styles.senderCard, 
                                    selectedSender === acc.account_number && styles.senderCardActive
                                ]}
                                onPress={() => setSelectedSender(acc.account_number)}
                            >
                                <View style={styles.senderHeader}>
                                    <Wallet size={16} color={selectedSender === acc.account_number ? '#fff' : '#6366f1'} />
                                    <Text style={[styles.senderNum, selectedSender === acc.account_number && styles.textWhite]}>{acc.account_number}</Text>
                                </View>
                                <Text style={[styles.senderBal, selectedSender === acc.account_number && styles.textWhite]}>
                                    ${parseFloat(acc.balance).toLocaleString('es-CL')}
                                </Text>
                                <Text style={[styles.senderLabel, selectedSender === acc.account_number && styles.textWhite70]}>Saldo Disponible</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Type Selector */}
                <View style={styles.typeSelector}>
                    <TouchableOpacity 
                        style={[styles.typeBtn, transferType === 'own' && styles.typeBtnActive]}
                        onPress={() => setTransferType('own')}
                    >
                        <ShieldCheck color={transferType === 'own' ? '#fff' : '#475569'} size={16} />
                        <Text style={[styles.typeText, transferType === 'own' && styles.typeTextActive]}>Propia</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.typeBtn, transferType === 'third-party' && styles.typeBtnActive]}
                        onPress={() => {
                            setTransferType('third-party');
                            setReceiver('');
                        }}
                    >
                        <User color={transferType === 'third-party' ? '#fff' : '#475569'} size={16} />
                        <Text style={[styles.typeText, transferType === 'third-party' && styles.typeTextActive]}>Terceros</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.typeBtn, transferType === 'interbank' && styles.typeBtnActive]}
                        onPress={() => {
                            setTransferType('interbank');
                            setReceiver('');
                        }}
                    >
                        <Zap color={transferType === 'interbank' ? '#fff' : '#475569'} size={16} />
                        <Text style={[styles.typeText, transferType === 'interbank' && styles.typeTextActive]}>Aerum</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.form}>
                    <Text style={styles.label}>
                        {transferType === 'own' ? 'Seleccionar Cuenta de Destino' : 
                         transferType === 'interbank' ? 'Número de Cuenta (Banco Aerum)' : 
                         'Número de Cuenta de Destino'}
                    </Text>
                    {transferType === 'own' ? (
                        <View style={styles.accountsGrid}>
                            {accounts.filter(a => a.account_number !== selectedSender).map((acc) => (
                                <TouchableOpacity 
                                    key={acc.account_number} 
                                    style={[styles.accCard, receiver === acc.account_number && styles.accCardActive]}
                                    onPress={() => setReceiver(acc.account_number)}
                                >
                                    <CreditCard size={20} color={receiver === acc.account_number ? '#fff' : '#6366f1'} />
                                    <View>
                                        <Text style={[styles.accNum, receiver === acc.account_number && styles.textWhite]}>{acc.account_number}</Text>
                                        <Text style={[styles.accType, receiver === acc.account_number && styles.textWhite70]}>
                                            {acc.account_number.startsWith('SAV') ? 'Ahorros' : 'Corriente'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {accounts.length < 2 && (
                                <Text style={styles.infoText}>No tienes otras cuentas propias para transferir.</Text>
                            )}
                        </View>
                    ) : (
                        <View style={styles.inputWrapper}>
                            <TextInput 
                                style={styles.input}
                                placeholder={transferType === 'interbank' ? "Ej: 1020304050" : "SAV-XXXXX o CHK-XXXXX"}
                                placeholderTextColor="#475569"
                                value={receiver}
                                onChangeText={setReceiver}
                            />
                        </View>
                    )}


                    <Text style={styles.label}>Monto a Transferir</Text>
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencyIcon}>$</Text>
                        <TextInput 
                            style={styles.amountInput}
                            placeholder="0"
                            placeholderTextColor="#1e293b"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>

                    <Text style={styles.label}>Concepto (Opcional)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Ej: Pago de servicios, Almuerzo..."
                            placeholderTextColor="#475569"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.submitBtn, (loading || !amount || !receiver) && styles.submitBtnDisabled]}
                        onPress={handleTransfer}
                        disabled={loading || !amount || !receiver}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitBtnText}>Confirmar Envío</Text>
                                <ArrowRight color="#fff" size={20} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        flex: 1,
        backgroundColor: '#020408',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 60,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
    },
    brandTag: {
        fontSize: 10,
        fontWeight: '900',
        color: '#6366f1',
        letterSpacing: 2,
        marginBottom: 4,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    closeButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    section: {
        marginBottom: 30,
    },
    sectionLabel: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 15,
    },
    horizontalScroll: {
        gap: 12,
    },
    senderCard: {
        width: 180,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    senderCardActive: {
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
    },
    senderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    senderNum: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    senderBal: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    senderLabel: {
        color: '#475569',
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 2,
    },
    typeSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 18,
        padding: 6,
        marginBottom: 35,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    typeBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 14,
    },
    typeBtnActive: {
        backgroundColor: '#6366f1',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    typeText: {
        color: '#475569',
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    typeTextActive: {
        color: '#fff',
    },
    form: {
        gap: 12,
    },
    label: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        marginTop: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    inputWrapper: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 18,
        paddingHorizontal: 18,
        height: 60,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    currencyIcon: {
        fontSize: 42,
        color: '#6366f1',
        fontWeight: '900',
        marginRight: 12,
    },
    amountInput: {
        flex: 1,
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
        letterSpacing: -2,
    },
    accountsGrid: {
        gap: 12,
    },
    accCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    accCardActive: {
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
    },
    accNum: {
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    accType: {
        color: '#475569',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    infoText: {
        color: '#475569',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 5,
    },
    submitBtn: {
        backgroundColor: '#6366f1',
        height: 65,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 35,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    submitBtnDisabled: {
        opacity: 0.4,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    textWhite: { color: '#fff' },
    textWhite70: { color: 'rgba(255,255,255,0.7)' },
});
