import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, Send, Bell, User, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../../services/api';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [balanceRes, historyRes] = await Promise.all([
                api.get('/user/balance'),
                api.get('/transactions/history')
            ]);
            setAccounts(balanceRes.data);
            setTransactions(historyRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const handleLogout = () => {
        setAuthToken(null);
        router.replace('/login');
    };

    const totalBalance = accounts.reduce((acc, curr) => acc + parseFloat(curr.balance), 0);
    const mainAccount = accounts[0] || { balance: 0, account_number: '---' };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hola de nuevo,</Text>
                        <Text style={styles.userName}>Bienvenido a Sentendar</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
                            <LogOut color="#ef4444" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, styles.avatarButton]}>
                            <User color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card Section */}
                <LinearGradient
                    colors={['#6366f1', '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>SALDO TOTAL</Text>
                        <Wallet color="rgba(255,255,255,0.6)" size={20} />
                    </View>
                    <Text style={styles.balanceAmount}>${totalBalance.toLocaleString()}</Text>
                    <View style={styles.cardNumberContainer}>
                        <Text style={styles.cardNumber}>•••• •••• •••• 4291</Text>
                        <Text style={styles.cardExpiry}>12 / 28</Text>
                    </View>
                </LinearGradient>

                {/* Accounts List (Horizontal) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsScroll}>
                    {accounts.map((acc, i) => (
                        <View key={i} style={styles.accountItem}>
                            <Text style={styles.accountType}>{acc.account_number.startsWith('SAV') ? 'Ahorros' : 'Corriente'}</Text>
                            <Text style={styles.accountNumberText}>{acc.account_number}</Text>
                            <Text style={styles.accountBalance}>${parseFloat(acc.balance).toLocaleString()}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                    <ActionItem 
                        icon={<Send color="#6366f1" size={24} />} 
                        label="Enviar" 
                        onPress={() => router.push('/modal')} // Placeholder for transfer
                    />
                    <ActionItem 
                        icon={<Plus color="#6366f1" size={24} />} 
                        label="Depositar" 
                        onPress={() => router.push('/deposit')}
                    />
                    <ActionItem icon={<ArrowUpRight color="#6366f1" size={24} />} label="Pagar" />
                    <ActionItem 
                        icon={<ArrowDownLeft color="#6366f1" size={24} />} 
                        label="Historial" 
                        onPress={() => router.push('/transactions')}
                    />
                </View>

                {/* Transactions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                    <TouchableOpacity onPress={() => router.push('/transactions')}>
                        <Text style={styles.viewAll}>Ver Todo</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionsList}>
                    {transactions.length > 0 ? (
                        transactions.slice(0, 5).map((item) => (
                            <View key={item.id} style={styles.txItem}>
                                <View style={[styles.txIcon, { backgroundColor: item.type === 'deposit' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }]}>
                                    {item.type === 'deposit' ? <ArrowDownLeft color="#10b981" size={20} /> : <ArrowUpRight color="#ef4444" size={20} />}
                                </View>
                                <View style={styles.txInfo}>
                                    <Text style={styles.txTitle}>{item.description || (item.type === 'deposit' ? 'Depósito' : 'Transferencia')}</Text>
                                    <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                                </View>
                                <Text style={[styles.txAmount, { color: item.type === 'deposit' ? '#10b981' : '#fff' }]}>
                                    {item.type === 'deposit' ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No hay transacciones aún</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ActionItem({ icon, label, onPress }: any) {
    return (
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <View style={styles.actionIcon}>{icon}</View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        color: '#94a3b8',
        fontSize: 14,
    },
    userName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarButton: {
        backgroundColor: '#6366f1',
    },
    balanceCard: {
        width: '100%',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 34,
        fontWeight: '800',
        marginBottom: 30,
    },
    cardNumberContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardNumber: {
        color: '#fff',
        fontSize: 16,
        letterSpacing: 2,
    },
    cardExpiry: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontWeight: 'bold',
    },
    accountsScroll: {
        marginBottom: 30,
    },
    accountItem: {
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 16,
        marginRight: 15,
        width: 150,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    accountType: {
        color: '#6366f1',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    accountNumberText: {
        color: '#94a3b8',
        fontSize: 11,
        marginVertical: 4,
    },
    accountBalance: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionButton: {
        alignItems: 'center',
        gap: 8,
    },
    actionIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#1e293b',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAll: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: 'bold',
    },
    transactionsList: {
        gap: 12,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 16,
    },
    txIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    txInfo: {
        flex: 1,
    },
    txTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    txDate: {
        color: '#94a3b8',
        fontSize: 11,
        marginTop: 2,
    },
    txAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#475569',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
    }
});
