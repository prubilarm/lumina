import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { ShieldAlert, Users, Activity, ArrowLeft, Search, TrendingUp, RefreshCw, Eye, Calendar, User as UserIcon, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function AdminScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [usersRes, txsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/transactions')
            ]);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setTransactions(Array.isArray(txsRes.data) ? txsRes.data : []);
        } catch (err) {
            setError('Acceso Denegado: Protocolo de Seguridad Lumina-Admin');
            setTimeout(() => router.back(), 3000);
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

    const totalFunds = users.reduce((acc, u) => acc + parseFloat(u.balance || 0), 0);

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#a855f7" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <ShieldAlert color="#ef4444" size={60} />
                <Text style={styles.errorTitle}>{error}</Text>
                <Text style={styles.errorSubtitle}>Regresando a zona segura...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#020408', '#0f172a']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft color="#fff" size={24} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.adminTag}>TERMINAL AUDITOR v2.0</Text>
                        <Text style={styles.title}>Mainframe Lumina</Text>
                    </View>
                </View>

                {/* Global Stats */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.statsScroll}
                    contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
                >
                    <StatBox label="Usuarios" value={users.length.toString()} icon={<Users color="#a855f7" size={16} />} />
                    <StatBox label="Liquidez" value={`$${(totalFunds / 1000000).toFixed(1)}M`} icon={<TrendingUp color="#10b981" size={16} />} highlight />
                    <StatBox label="Actividad" value={transactions.length.toString()} icon={<Activity color="#22d3ee" size={16} />} />
                </ScrollView>

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'users' && styles.tabActive]}
                        onPress={() => setActiveTab('users')}
                    >
                        <Users color={activeTab === 'users' ? '#fff' : '#64748b'} size={18} />
                        <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>Usuarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, activeTab === 'audit' && styles.tabActive]}
                        onPress={() => setActiveTab('audit')}
                    >
                        <Activity color={activeTab === 'audit' ? '#fff' : '#64748b'} size={18} />
                        <Text style={[styles.tabText, activeTab === 'audit' && styles.tabTextActive]}>Auditoría</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a855f7" />
                    }
                >
                    {activeTab === 'users' ? (
                        <View style={styles.listContainer}>
                            {users.map((u) => (
                                <View key={u.id} style={styles.userCard}>
                                    <View style={styles.userHeader}>
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>{u.full_name?.charAt(0)}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.userName}>{u.full_name}</Text>
                                            <Text style={styles.userEmail}>{u.email}</Text>
                                        </View>
                                        <View style={styles.roleBadge}>
                                            <Text style={styles.roleText}>{u.role}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.userFooter}>
                                        <View>
                                            <Text style={styles.balLabel}>LIQUIDEZ TOTAL</Text>
                                            <Text style={styles.balValue}>${parseFloat(u.balance || 0).toLocaleString('es-CL')}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.viewBtn}>
                                            <Eye color="#a855f7" size={18} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.listContainer}>
                            {transactions.map((tx) => (
                                <View key={tx.id} style={styles.txCard}>
                                    <View style={styles.txMain}>
                                        <View style={[styles.txIcon, { backgroundColor: tx.type === 'deposit' ? 'rgba(16,185,129,0.1)' : 'rgba(168,85,247,0.1)' }]}>
                                            {tx.type === 'deposit' ? <Zap color="#10b981" size={20} /> : <TrendingUp color="#a855f7" size={20} />}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.txTitle} numberOfLines={1}>{tx.description || 'Transferencia P2P'}</Text>
                                            <Text style={styles.txUser}>{tx.sender_name || 'System'} → {tx.receiver_name || 'Vault'}</Text>
                                        </View>
                                        <Text style={[styles.txAmount, { color: tx.type === 'deposit' ? '#10b981' : '#fff' }]}>
                                            {tx.type === 'deposit' ? '+' : '-'}${Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={styles.txMeta}>
                                        <Calendar size={10} color="#475569" />
                                        <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleString()}</Text>
                                        <Text style={styles.txId}>ID: {tx.id.toString().slice(0, 8).toUpperCase()}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function StatBox({ label, value, icon, highlight }: any) {
    return (
        <View style={[styles.statBox, highlight && styles.statBoxHighlight]}>
            <View style={styles.statHeader}>
                {icon}
                <Text style={styles.statLabel}>{label}</Text>
            </View>
            <Text style={styles.statValue}>{value}</Text>
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
    errorContainer: {
        flex: 1,
        backgroundColor: '#020408',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: 20,
    },
    errorSubtitle: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        gap: 20,
        marginBottom: 30,
    },
    backBtn: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    adminTag: {
        color: '#a855f7',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -1,
    },
    statsScroll: {
        maxHeight: 100,
        marginBottom: 30,
    },
    statBox: {
        width: 130,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statBoxHighlight: {
        borderColor: 'rgba(168,85,247,0.3)',
        backgroundColor: 'rgba(168,85,247,0.05)',
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    statLabel: {
        color: '#64748b',
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 6,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 15,
    },
    tabActive: {
        backgroundColor: '#a855f7',
    },
    tabText: {
        color: '#64748b',
        fontSize: 13,
        fontWeight: '900',
    },
    tabTextActive: {
        color: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    listContainer: {
        gap: 12,
    },
    userCard: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 18,
        backgroundColor: 'rgba(168,85,247,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(168,85,247,0.2)',
    },
    avatarText: {
        color: '#a855f7',
        fontSize: 20,
        fontWeight: '900',
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
    },
    userEmail: {
        color: '#64748b',
        fontSize: 12,
    },
    roleBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    roleText: {
        color: '#94a3b8',
        fontSize: 8,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    userFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    balLabel: {
        color: '#475569',
        fontSize: 9,
        fontWeight: '900',
        marginBottom: 4,
    },
    balValue: {
        color: '#22d3ee',
        fontSize: 20,
        fontWeight: '900',
    },
    viewBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txCard: {
        backgroundColor: 'rgba(255,255,255,0.01)',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    txMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    txIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
    },
    txUser: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 2,
    },
    txAmount: {
        fontSize: 18,
        fontWeight: '900',
    },
    txMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.02)',
    },
    txDate: {
        color: '#475569',
        fontSize: 10,
        fontWeight: 'bold',
        flex: 1,
    },
    txId: {
        color: '#1e293b',
        fontSize: 10,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    }
});
