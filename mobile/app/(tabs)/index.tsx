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

    const [isBalanceHidden, setIsBalanceHidden] = useState(false);

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
                        <Text style={styles.greeting}>Hola,</Text>
                        <Text style={styles.userName}>Terminal Lumina</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity 
                            style={styles.iconButton} 
                            onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                        >
                            {isBalanceHidden ? <Bell color="#fff" size={20} /> : <Bell color="#6366f1" size={20} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, styles.avatarButton]}>
                            <User color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Futuristic Card Gallery */}
                <View style={styles.galleryContainer}>
                    <View style={styles.galleryHeader}>
                        <Text style={styles.galleryTitle}>Mis Productos</Text>
                        <TouchableOpacity onPress={() => setIsBalanceHidden(!isBalanceHidden)}>
                            <Text style={styles.hideText}>{isBalanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        horizontal 
                        pagingEnabled 
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width - 40}
                        decelerationRate="fast"
                        style={styles.cardCarousel}
                    >
                        {accounts.map((acc, i) => {
                            const isCredit = i === 1; // Alternating or based on data
                            return (
                                <View key={i} style={[styles.cardWrapper, { width: width - 40 }]}>
                                    <View style={[styles.plasticCard, isCredit ? styles.cardCredit : styles.cardDebit]}>
                                        <View style={styles.cardTop}>
                                            <View>
                                                <Text style={[styles.cardAccountName, isCredit ? styles.textWhite : styles.textDark]}>
                                                    {isCredit ? 'Lumina Platinum' : 'CuentaRUT'}
                                                </Text>
                                                <Text style={[styles.cardAccountNumber, isCredit ? styles.textLight : styles.textMuted]}>
                                                    {acc.account_number}
                                                </Text>
                                            </View>
                                            <TouchableOpacity>
                                                <Send color={isCredit ? 'rgba(255,255,255,0.4)' : '#94a3b8'} size={20} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.cardMiddle}>
                                            <Text style={[styles.cardBalance, isCredit ? styles.textWhite : styles.textDark]}>
                                                {isBalanceHidden ? '$ ••••••' : `$${parseFloat(acc.balance).toLocaleString('es-CL')}`}
                                            </Text>
                                            <Text style={[styles.cardBalanceLabel, isCredit ? styles.textLight : styles.textMuted]}>
                                                Saldo disponible
                                            </Text>
                                        </View>

                                        <View style={styles.cardBottom}>
                                            <TouchableOpacity 
                                                style={[styles.cardButton, isCredit ? styles.btnCreditPrimary : styles.btnDebitPrimary]}
                                                onPress={() => router.push('/transactions')}
                                            >
                                                <Text style={styles.btnTextPrimary}>Movimientos</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[styles.cardButton, isCredit ? styles.btnCreditSecondary : styles.btnDebitSecondary]}
                                            >
                                                <Text style={[styles.btnTextSecondary, !isCredit && styles.textBlue]}>Cartolas</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Pagination Indicators */}
                    <View style={styles.pagination}>
                        {accounts.map((_, i) => (
                            <View key={i} style={[styles.dot, i === 0 ? styles.activeDot : null]} />
                        ))}
                    </View>
                </View>

                {/* Quick Actions Grid */}
                <View style={styles.quickActionsGrid}>
                    <ActionSquare icon={<Plus color="#fff" size={24} />} label="Depositar" color="#10b981" onPress={() => router.push('/modal')} />
                    <ActionSquare icon={<Send color="#fff" size={24} />} label="Transferir" color="#6366f1" onPress={() => router.push('/modal')} />
                    <ActionSquare icon={<ArrowUpRight color="#fff" size={24} />} label="Pagos" color="#f59e0b" />
                    <ActionSquare icon={<LogOut color="#fff" size={24} />} label="Salir" color="#ef4444" onPress={handleLogout} />
                </View>

                {/* Transactions Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                    <TouchableOpacity onPress={() => router.push('/transactions')}>
                        <Text style={styles.viewAll}>Ver todo</Text>
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
                                    {item.type === 'deposit' ? '+' : '-'}${parseFloat(item.amount).toLocaleString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No hay movimientos registrados</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ActionSquare({ icon, label, color, onPress }: any) {
    return (
        <TouchableOpacity style={styles.actionSquare} onPress={onPress}>
            <View style={[styles.actionSquareIcon, { backgroundColor: color }]}>
                {icon}
            </View>
            <Text style={styles.actionSquareLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Deeper dark for futuristic feel
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 25,
    },
    greeting: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    avatarButton: {
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
    },
    galleryContainer: {
        marginBottom: 30,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 25,
        marginBottom: 15,
    },
    galleryTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hideText: {
        color: '#6366f1',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardCarousel: {
        paddingLeft: 20,
    },
    cardWrapper: {
        marginRight: 15,
    },
    plasticCard: {
        height: 220,
        borderRadius: 28,
        padding: 24,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    cardDebit: {
        backgroundColor: '#ffffff',
    },
    cardCredit: {
        backgroundColor: '#1e293b',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardAccountName: {
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    cardAccountNumber: {
        fontSize: 11,
        fontFamily: 'System',
        marginTop: 2,
    },
    cardMiddle: {
        marginVertical: 10,
    },
    cardBalance: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
    },
    cardBalanceLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 2,
    },
    cardBottom: {
        flexDirection: 'row',
        gap: 10,
    },
    cardButton: {
        flex: 1,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnDebitPrimary: {
        backgroundColor: '#3b5998',
    },
    btnDebitSecondary: {
        borderWidth: 1,
        borderColor: '#3b5998',
    },
    btnCreditPrimary: {
        backgroundColor: '#6366f1',
    },
    btnCreditSecondary: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    btnTextPrimary: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    btnTextSecondary: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    textWhite: { color: '#fff' },
    textDark: { color: '#0f172a' },
    textLight: { color: 'rgba(255,255,255,0.5)' },
    textMuted: { color: '#64748b' },
    textBlue: { color: '#3b5998' },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 15,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    activeDot: {
        width: 20,
        backgroundColor: '#6366f1',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 35,
    },
    actionSquare: {
        width: (width - 52) / 2,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    actionSquareIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionSquareLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    viewAll: {
        color: '#6366f1',
        fontSize: 13,
        fontWeight: 'bold',
    },
    transactionsList: {
        paddingHorizontal: 20,
        gap: 12,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    txIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
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
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
    },
    txAmount: {
        fontSize: 15,
        fontWeight: '900',
    },
    emptyText: {
        color: '#475569',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
    }
});
