import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { LayoutDashboard, CreditCard, ArrowUpRight, ArrowDownLeft, History as HistoryIcon, LogOut, Plus, Send, Bell, User, Zap, ShieldCheck, ArrowRight, TrendingUp, Wallet } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../../services/api';
import PlasticCard from '../../components/PlasticCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const fetchData = async () => {
        try {
            const [userRes, balanceRes, historyRes] = await Promise.all([
                api.get('/auth/me'),
                api.get('/user/balance'),
                api.get('/transactions/history')
            ]);
            setUser(userRes.data);
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
        <View style={styles.container}>
            <LinearGradient
                colors={['#020408', '#05070A']}
                style={StyleSheet.absoluteFill}
            />
            
            <SafeAreaView style={{ flex: 1 }}>
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
                            <Text style={styles.greeting}>Hola, {user?.full_name?.split(' ')[0] || 'Cliente'}</Text>
                            <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>ESTADO: <Text style={styles.activeStatus}>ACTIVA</Text></Text>
                                <Text style={styles.premiumLabel}>• PREMIUM</Text>
                            </View>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity 
                                style={[styles.iconButton, styles.transferQuickBtn]}
                                onPress={() => router.push('/modal')}
                            >
                                <Send color="#fff" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Bell color="#94a3b8" size={20} />
                                <View style={styles.notificationDot} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.iconButton, styles.avatarButton]}
                                onPress={() => router.push('/settings')}
                            >
                                <User color="#fff" size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Card Gallery Section */}
                    <View style={styles.galleryContainer}>
                        <View style={styles.galleryHeader}>
                            <View>
                                <Text style={styles.brandTitle}>Lumina Wealth</Text>
                                <Text style={styles.galleryTitle}>Mis Productos Digitales</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.eyeBtn}
                                onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                            >
                                <Text style={styles.hideText}>{isBalanceHidden ? 'Mostrar' : 'Ocultar'}</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            horizontal 
                            pagingEnabled 
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={width - 40}
                            decelerationRate="fast"
                            onScroll={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                                if (index !== activeCardIndex) setActiveCardIndex(index);
                            }}
                            scrollEventThrottle={16}
                            style={styles.cardCarousel}
                        >
                            {accounts.length > 0 ? (
                                accounts.map((acc, i) => (
                                    <View key={i} style={styles.cardWrapper}>
                                        <PlasticCard 
                                            account={acc}
                                            isCredit={i === 0}
                                            isBalanceHidden={isBalanceHidden}
                                            onAction={(type) => {
                                                if (type === 'movimientos') router.push('/history');
                                            }}
                                        />
                                    </View>
                                ))
                            ) : (
                                <View style={styles.cardWrapper}>
                                    <PlasticCard 
                                        account={{ balance: 0, account_number: 'N/A', name: 'Buscando cuentas...' }}
                                        isBalanceHidden={isBalanceHidden}
                                    />
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.pagination}>
                            {accounts.map((_, i) => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.dot, 
                                        i === activeCardIndex ? styles.activeDot : null
                                    ]} 
                                />
                            ))}
                        </View>
                    </View>

                    {/* Admin Section (Conditional) */}
                    {user?.role === 'admin' && (
                        <View style={styles.adminSection}>
                            <LinearGradient
                                colors={['rgba(168, 85, 247, 0.15)', 'rgba(168, 85, 247, 0.05)']}
                                style={styles.adminCard}
                            >
                                <View style={styles.adminInfo}>
                                    <View style={styles.adminIconWrapper}>
                                        <ShieldCheck color="#a855f7" size={24} />
                                    </View>
                                    <View>
                                        <Text style={styles.adminTitle}>Terminal de Auditoría</Text>
                                        <Text style={styles.adminSubtitle}>Acceso de Nivel Administrativo</Text>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.adminActionBtn}
                                    onPress={() => router.push('/admin')}
                                >
                                    <Text style={styles.adminActionText}>Ingresar</Text>
                                    <ArrowRight color="#fff" size={16} />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Summary Widgets */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.sectionLabel}>Resumen de Actividad</Text>
                        <View style={styles.summaryGrid}>
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                    <ArrowDownLeft color="#10b981" size={20} />
                                </View>
                                <View>
                                    <Text style={styles.summaryLabel}>Ingresos</Text>
                                    <Text style={[styles.summaryAmount, styles.incomeText]}>+$1.2M</Text>
                                </View>
                            </View>
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
                                    <ArrowUpRight color="#f43f5e" size={20} />
                                </View>
                                <View>
                                    <Text style={styles.summaryLabel}>Gastos</Text>
                                    <Text style={[styles.summaryAmount, styles.expenseText]}>-$450K</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Quick Actions Grid */}
                    <View style={styles.quickActionsGrid}>
                        <ActionSquare icon={<Plus color="#fff" size={22} />} label="Depositar" color="#10b981" onPress={() => router.push('/deposit')} />
                        <ActionSquare icon={<Send color="#fff" size={22} />} label="Transferir" color="#6366f1" onPress={() => router.push('/modal')} />
                        <ActionSquare icon={<Wallet color="#fff" size={22} />} label="Pagos" color="#f59e0b" />
                        <ActionSquare icon={<TrendingUp color="#fff" size={22} />} label="Inversión" color="#a855f7" onPress={() => router.push('/investments')} />
                    </View>

                    {/* Transactions Section */}
                    <View style={styles.transactionsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
                            <TouchableOpacity onPress={() => router.push('/history')}>
                                <Text style={styles.viewAll}>Ver todo</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.transactionsList}>
                            {transactions.length > 0 ? (
                                transactions.slice(0, 5).map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.txItem}>
                                        <View style={[
                                            styles.txIcon, 
                                            { backgroundColor: item.type === 'deposit' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)' }
                                        ]}>
                                            {item.type === 'deposit' ? 
                                                <ArrowDownLeft color="#10b981" size={20} /> : 
                                                <ArrowUpRight color="#f43f5e" size={20} />
                                            }
                                        </View>
                                        <View style={styles.txInfo}>
                                            <Text style={styles.txTitle}>{item.description || (item.type === 'deposit' ? 'Depósito Recibido' : 'Transferencia Enviada')}</Text>
                                            <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                                        </View>
                                        <Text style={[
                                            styles.txAmount, 
                                            { color: item.type === 'deposit' ? '#10b981' : '#fff' }
                                        ]}>
                                            {item.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(item.amount)).toLocaleString('es-CL')}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No hay movimientos registrados</Text>
                                </View>
                            )}
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.detailedReportBtn}
                            onPress={() => router.push('/history')}
                        >
                            <Text style={styles.detailedReportText}>Ver reporte detallado</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
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
    },
    centered: {
        flex: 1,
        backgroundColor: '#020408',
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
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 30,
    },
    greeting: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: -1,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#475569',
        letterSpacing: 1,
    },
    activeStatus: {
        color: '#10b981',
    },
    premiumLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: '#6366f1',
        marginLeft: 4,
        letterSpacing: 1,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    notificationDot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        backgroundColor: '#6366f1',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#020408',
    },
    avatarButton: {
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    transferQuickBtn: {
        backgroundColor: '#6366f1',
        borderColor: '#818cf8',
    },
    galleryContainer: {
        marginBottom: 35,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 28,
        marginBottom: 20,
    },
    brandTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: '#22d3ee',
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 2,
    },
    galleryTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    eyeBtn: {
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    hideText: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cardCarousel: {
        paddingLeft: 20,
    },
    cardWrapper: {
        marginRight: 12,
        width: width - 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    activeDot: {
        width: 30,
        backgroundColor: '#22d3ee',
        shadowColor: '#22d3ee',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    summaryContainer: {
        paddingHorizontal: 24,
        marginBottom: 35,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 15,
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    summaryItem: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    summaryIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: '900',
        marginTop: 2,
    },
    incomeText: { color: '#10b981' },
    expenseText: { color: '#f43f5e' },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 40,
    },
    actionSquare: {
        width: (width - 60) / 2,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    actionSquareIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionSquareLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    transactionsSection: {
        backgroundColor: 'rgba(5, 7, 10, 0.5)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingTop: 30,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    viewAll: {
        color: '#6366f1',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    transactionsList: {
        gap: 10,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
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
        color: '#475569',
        fontSize: 11,
        marginTop: 2,
        fontWeight: 'bold',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '900',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#475569',
        fontStyle: 'italic',
        fontSize: 13,
    },
    detailedReportBtn: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    detailedReportText: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    adminSection: {
        paddingHorizontal: 24,
        marginBottom: 35,
    },
    adminCard: {
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    adminInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    adminIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
    },
    adminSubtitle: {
        color: '#64748b',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    adminActionBtn: {
        backgroundColor: '#a855f7',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    adminActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '900',
    }
});
