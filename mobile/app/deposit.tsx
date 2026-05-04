import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ArrowLeft, Landmark, CreditCard, Zap, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';

const { width } = Dimensions.get('window');

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
            // Using the transfer endpoint for self-deposit simulation or a specific deposit endpoint if exists
            // Based on backend controllers, there is a 'deposit' method in transactionController
            await api.post('/transactions/deposit', {
                amount: parseFloat(amount),
                account_number: selectedAccount,
                description: 'Depósito Inmediato Lumina'
            });
            Alert.alert('Éxito', 'Fondos depositados correctamente', [
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft color="#fff" size={24} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.brandTag}>LUMINA ASSETS</Text>
                        <Text style={styles.title}>Cargar Fondos</Text>
                    </View>
                </View>

                <View style={styles.heroSection}>
                    <View style={styles.iconGlow}>
                        <LinearGradient
                            colors={['#10b981', '#34d399']}
                            style={styles.iconCircle}
                        >
                            <Zap color="#fff" size={32} fill="currentColor" />
                        </LinearGradient>
                    </View>
                    <Text style={styles.heroTitle}>Inyección de Capital</Text>
                    <Text style={styles.heroSubtitle}>Los fondos se verán reflejados de forma inmediata en tu saldo disponible.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Seleccionar Cuenta de Destino</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalScroll}
                    >
                        {accounts.map((acc) => (
                            <TouchableOpacity 
                                key={acc.account_number}
                                style={[
                                    styles.accCard, 
                                    selectedAccount === acc.account_number && styles.accCardActive
                                ]}
                                onPress={() => setSelectedAccount(acc.account_number)}
                            >
                                <View style={styles.accHeader}>
                                    <CreditCard size={16} color={selectedAccount === acc.account_number ? '#fff' : '#10b981'} />
                                    <Text style={[styles.accNum, selectedAccount === acc.account_number && styles.textWhite]}>{acc.account_number}</Text>
                                </View>
                                <Text style={[styles.accBal, selectedAccount === acc.account_number && styles.textWhite]}>
                                    ${parseFloat(acc.balance).toLocaleString('es-CL')}
                                </Text>
                                <Text style={[styles.accLabel, selectedAccount === acc.account_number && styles.textWhite70]}>Saldo Actual</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.amountSection}>
                    <Text style={styles.sectionLabel}>Monto a Inyectar</Text>
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

                    <View style={styles.securityBanner}>
                        <ShieldCheck color="#10b981" size={16} />
                        <Text style={styles.securityText}>Operación Protegida por Lumina Shield</Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.submitBtn, (loading || !amount) && styles.submitBtnDisabled]}
                        onPress={handleDeposit}
                        disabled={loading || !amount}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitBtnText}>Confirmar Depósito</Text>
                                <Plus color="#fff" size={24} />
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
        alignItems: 'center',
        gap: 20,
        marginBottom: 40,
        marginTop: Platform.OS === 'ios' ? 20 : 10,
    },
    backButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    brandTag: {
        fontSize: 10,
        fontWeight: '900',
        color: '#10b981',
        letterSpacing: 2,
        marginBottom: 4,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconGlow: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(16,185,129,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 10,
    },
    heroSubtitle: {
        color: '#475569',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 40,
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
    accCard: {
        width: 180,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    accCardActive: {
        backgroundColor: '#10b981',
        borderColor: '#34d399',
    },
    accHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 15,
    },
    accNum: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    accBal: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    accLabel: {
        color: '#475569',
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 4,
    },
    amountSection: {
        gap: 10,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    currencyIcon: {
        fontSize: 42,
        color: '#10b981',
        fontWeight: '900',
        marginRight: 12,
    },
    amountInput: {
        flex: 1,
        color: '#fff',
        fontSize: 56,
        fontWeight: '900',
        letterSpacing: -2,
    },
    securityBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(16,185,129,0.05)',
        paddingVertical: 12,
        borderRadius: 14,
        marginBottom: 20,
    },
    securityText: {
        color: '#10b981',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    submitBtn: {
        backgroundColor: '#10b981',
        height: 70,
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#10b981',
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
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    textWhite: { color: '#fff' },
    textWhite70: { color: 'rgba(255,255,255,0.7)' },
});
