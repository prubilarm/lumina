import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { TrendingUp, Zap, ArrowUpRight, ShieldCheck, PieChart, Info, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function InvestmentsScreen() {
    const [loading, setLoading] = useState(false);

    const investments = [
        { id: 1, asset: 'Bitcoin', symbol: 'BTC', amount: '0.428', value: '$28.450', change: '+12.4%', color: '#f59e0b' },
        { id: 2, asset: 'Ethereum', symbol: 'ETH', amount: '4.5', value: '$11.200', change: '+5.2%', color: '#6366f1' },
        { id: 3, asset: 'Lumina Tech', symbol: 'LTI', amount: '120.0', value: '$5.600', change: '-2.1%', color: '#22d3ee' }
    ];

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#a855f7" />
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
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.brandTag}>LUMINA WEALTH</Text>
                            <Text style={styles.title}>Inversiones</Text>
                        </View>
                        <TouchableOpacity style={styles.infoBtn}>
                            <Info color="#94a3b8" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Portfolio Value Card */}
                    <View style={styles.portfolioCard}>
                        <LinearGradient
                            colors={['rgba(168, 85, 247, 0.15)', 'rgba(168, 85, 247, 0.05)']}
                            style={styles.portfolioGradient}
                        >
                            <View style={styles.portfolioHeader}>
                                <View style={styles.portfolioIcon}>
                                    <TrendingUp color="#a855f7" size={24} />
                                </View>
                                <View style={styles.trendBadge}>
                                    <Text style={styles.trendText}>+8.4%</Text>
                                </View>
                            </View>
                            <Text style={styles.portfolioLabel}>VALOR TOTAL DE CARTERA</Text>
                            <Text style={styles.portfolioValue}>$45.250</Text>
                            
                            <View style={styles.allocationSection}>
                                <View style={styles.allocationBar}>
                                    <View style={[styles.barPart, { width: '60%', backgroundColor: '#f59e0b' }]} />
                                    <View style={[styles.barPart, { width: '25%', backgroundColor: '#6366f1' }]} />
                                    <View style={[styles.barPart, { width: '15%', backgroundColor: '#22d3ee' }]} />
                                </View>
                                <View style={styles.allocationLabels}>
                                    <Text style={styles.allocationText}>BTC 60%</Text>
                                    <Text style={styles.allocationText}>ETH 25%</Text>
                                    <Text style={styles.allocationText}>OTRO 15%</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    <View style={styles.assetsSection}>
                        <Text style={styles.sectionLabel}>Mis Activos</Text>
                        <View style={styles.assetList}>
                            {investments.map((inv) => (
                                <TouchableOpacity key={inv.id} style={styles.assetCard}>
                                    <View style={[styles.assetIcon, { backgroundColor: `${inv.color}15` }]}>
                                        <Text style={[styles.assetSymbol, { color: inv.color }]}>{inv.symbol.charAt(0)}</Text>
                                    </View>
                                    <View style={styles.assetInfo}>
                                        <Text style={styles.assetName}>{inv.asset}</Text>
                                        <Text style={styles.assetDetail}>{inv.amount} {inv.symbol}</Text>
                                    </View>
                                    <View style={styles.assetPrice}>
                                        <Text style={styles.assetValue}>{inv.value}</Text>
                                        <Text style={[styles.assetChange, { color: inv.change.startsWith('+') ? '#10b981' : '#f43f5e' }]}>
                                            {inv.change}
                                        </Text>
                                    </View>
                                    <ChevronRight color="#1e293b" size={18} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity style={styles.exploreBtn}>
                        <LinearGradient
                            colors={['#a855f7', '#6366f1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
                        />
                        <Text style={styles.exploreText}>Explorar Oportunidades</Text>
                        <ArrowUpRight color="#fff" size={20} />
                    </TouchableOpacity>

                    <View style={styles.securityBanner}>
                        <ShieldCheck color="#10b981" size={16} />
                        <Text style={styles.securityNote}>CARTERA PROTEGIDA POR LUMINA-CUSTODY</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
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
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 10,
    },
    brandTag: {
        fontSize: 10,
        fontWeight: '900',
        color: '#a855f7',
        letterSpacing: 2,
        marginBottom: 4,
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    infoBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    portfolioCard: {
        borderRadius: 32,
        overflow: 'hidden',
        marginBottom: 35,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.2)',
    },
    portfolioGradient: {
        padding: 28,
    },
    portfolioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    portfolioIcon: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    trendText: {
        color: '#10b981',
        fontSize: 12,
        fontWeight: '900',
    },
    portfolioLabel: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    portfolioValue: {
        color: '#fff',
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: -1,
        marginBottom: 30,
    },
    allocationSection: {
        gap: 12,
    },
    allocationBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.05)',
        flexDirection: 'row',
        overflow: 'hidden',
    },
    barPart: {
        height: '100%',
    },
    allocationLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    allocationText: {
        color: '#475569',
        fontSize: 9,
        fontWeight: '900',
    },
    assetsSection: {
        marginBottom: 40,
    },
    sectionLabel: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 20,
        marginLeft: 4,
    },
    assetList: {
        gap: 12,
    },
    assetCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 18,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    assetIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    assetSymbol: {
        fontSize: 20,
        fontWeight: '900',
    },
    assetInfo: {
        flex: 1,
    },
    assetName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    assetDetail: {
        color: '#475569',
        fontSize: 12,
        marginTop: 2,
        fontWeight: 'bold',
    },
    assetPrice: {
        alignItems: 'flex-end',
        marginRight: 15,
    },
    assetValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
    },
    assetChange: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 2,
    },
    exploreBtn: {
        height: 65,
        borderRadius: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    exploreText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    securityBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: 0.5,
    },
    securityNote: {
        color: '#475569',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    }
});
