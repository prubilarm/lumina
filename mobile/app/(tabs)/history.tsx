import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, Dimensions, Platform } from 'react-native';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions/history');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions();
    };

    const renderItem = ({ item }: { item: any }) => {
        const isDeposit = item.type === 'deposit';
        return (
            <TouchableOpacity style={styles.txItem}>
                <View style={[
                    styles.txIcon, 
                    { backgroundColor: isDeposit ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)' }
                ]}>
                    {isDeposit ? 
                        <ArrowDownLeft color="#10b981" size={22} /> : 
                        <ArrowUpRight color="#f43f5e" size={22} />
                    }
                </View>
                <View style={styles.txInfo}>
                    <Text style={styles.txTitle}>{item.description || (isDeposit ? 'Depósito' : 'Transferencia')}</Text>
                    <View style={styles.txMeta}>
                        <Clock size={10} color="#475569" />
                        <Text style={styles.txDate}>
                            {new Date(item.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>
                <View style={styles.txAmountContainer}>
                    <Text style={[styles.txAmount, { color: isDeposit ? '#10b981' : '#fff' }]}>
                        {isDeposit ? '+' : '-'}${parseFloat(item.amount).toLocaleString('es-CL')}
                    </Text>
                    <Text style={styles.txStatus}>COMPLETADO</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const totalIncome = transactions.filter(t => t.type === 'deposit').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const totalExpenses = transactions.filter(t => t.type !== 'deposit').reduce((acc, t) => acc + parseFloat(t.amount), 0);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#020408', '#05070A']}
                style={StyleSheet.absoluteFill}
            />
            
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.brandTag}>REGISTRO DE OPERACIONES</Text>
                        <Text style={styles.headerTitle}>Historial Global</Text>
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Filter color="#94a3b8" size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsSection}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.01)']}
                        style={styles.statsCard}
                    >
                        <View style={styles.statItem}>
                            <View style={styles.statHeader}>
                                <TrendingUp color="#10b981" size={16} />
                                <Text style={styles.statLabel}>Ingresos</Text>
                            </View>
                            <Text style={[styles.statValue, { color: '#10b981' }]}>
                                +${totalIncome.toLocaleString('es-CL')}
                            </Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.statHeader}>
                                <TrendingDown color="#f43f5e" size={16} />
                                <Text style={styles.statLabel}>Gastos</Text>
                            </View>
                            <Text style={[styles.statValue, { color: '#f43f5e' }]}>
                                -${totalExpenses.toLocaleString('es-CL')}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#6366f1" />
                    </View>
                ) : (
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Calendar color="rgba(255,255,255,0.05)" size={80} />
                                <Text style={styles.emptyText}>No hay transacciones registradas</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginBottom: 10,
    },
    headerTitleContainer: {
        flex: 1,
    },
    brandTag: {
        fontSize: 9,
        fontWeight: '900',
        color: '#6366f1',
        letterSpacing: 2,
        marginBottom: 2,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -1,
    },
    filterButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statsSection: {
        paddingHorizontal: 24,
        marginBottom: 30,
    },
    statsCard: {
        flexDirection: 'row',
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    statItem: {
        flex: 1,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    statLabel: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginHorizontal: 15,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
        borderRadius: 22,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    txIcon: {
        width: 52,
        height: 52,
        borderRadius: 18,
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
        marginBottom: 4,
    },
    txMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    txDate: {
        color: '#475569',
        fontSize: 11,
        fontWeight: 'bold',
    },
    txAmountContainer: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '900',
        marginBottom: 2,
    },
    txStatus: {
        color: '#10b981',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        color: '#475569',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
});
