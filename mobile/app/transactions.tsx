import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function TransactionsScreen() {
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

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.txItem}>
            <View style={[styles.txIcon, { backgroundColor: item.type === 'deposit' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }]}>
                {item.type === 'deposit' ? <ArrowDownLeft color="#10b981" size={20} /> : <ArrowUpRight color="#ef4444" size={20} />}
            </View>
            <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{item.description || (item.type === 'deposit' ? 'Depósito' : 'Transferencia')}</Text>
                <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <View style={styles.txAmountContainer}>
                <Text style={[styles.txAmount, { color: item.type === 'deposit' ? '#10b981' : '#fff' }]}>
                    {item.type === 'deposit' ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
                </Text>
                <Text style={styles.txCurrency}>USD</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Actividad</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Filter color="#94a3b8" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Ingresos</Text>
                    <Text style={[styles.statValue, { color: '#10b981' }]}>
                        +${transactions.filter(t => t.type === 'deposit').reduce((acc, t) => acc + parseFloat(t.amount), 0).toLocaleString()}
                    </Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Gastos</Text>
                    <Text style={[styles.statValue, { color: '#ef4444' }]}>
                        -${transactions.filter(t => t.type !== 'deposit').reduce((acc, t) => acc + parseFloat(t.amount), 0).toLocaleString()}
                    </Text>
                </View>
            </View>

            {loading ? (
                <View style={[styles.centered, { flex: 1 }]}>
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Calendar color="#334155" size={64} />
                            <Text style={styles.emptyText}>No hay transacciones registradas</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: '#1e293b',
        borderRadius: 12,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    filterButton: {
        padding: 8,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 16,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    txItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.02)',
    },
    txIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    txInfo: {
        flex: 1,
    },
    txTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    txDate: {
        color: '#64748b',
        fontSize: 11,
        marginTop: 4,
    },
    txAmountContainer: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    txCurrency: {
        color: '#475569',
        fontSize: 10,
        fontWeight: 'bold',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
        gap: 16,
    },
    emptyText: {
        color: '#475569',
        fontSize: 16,
    },
});
