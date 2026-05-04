import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { CreditCard, Plus, Shield, Lock, Eye, EyeOff, Smartphone, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PlasticCard from '../../components/PlasticCard';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function CardsScreen() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/user/balance');
            setAccounts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCard = () => {
        Alert.alert('Próximamente', 'Esta funcionalidad estará disponible en la próxima actualización de Lumina Bank.');
    };

    if (loading) {
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
            
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.brandTag}>LUMINA PLASTIC</Text>
                            <Text style={styles.title}>Mis Tarjetas</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.actionBtn}
                            onPress={() => setIsBalanceHidden(!isBalanceHidden)}
                        >
                            {isBalanceHidden ? <Eye color="#94a3b8" size={20} /> : <EyeOff color="#94a3b8" size={20} />}
                        </TouchableOpacity>
                    </View>

                    {/* Active Cards List */}
                    <View style={styles.cardsSection}>
                        {accounts.map((acc, i) => (
                            <View key={acc.account_number} style={styles.cardContainer}>
                                <PlasticCard 
                                    account={acc} 
                                    isCredit={i === 0} 
                                    isBalanceHidden={isBalanceHidden}
                                    hideActions={true}
                                />
                                <View style={styles.cardControls}>
                                    <TouchableOpacity style={styles.controlBtn}>
                                        <Lock color="#94a3b8" size={18} />
                                        <Text style={styles.controlText}>Bloquear</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.controlBtn}>
                                        <Shield color="#94a3b8" size={18} />
                                        <Text style={styles.controlText}>Seguridad</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.controlBtn}>
                                        <Smartphone color="#94a3b8" size={18} />
                                        <Text style={styles.controlText}>Digital</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Request New Card Section */}
                    <View style={styles.requestSection}>
                        <Text style={styles.sectionLabel}>Servicios Adicionales</Text>
                        <TouchableOpacity style={styles.requestCard} onPress={handleRequestCard}>
                            <View style={styles.requestIcon}>
                                <Plus color="#6366f1" size={24} />
                            </View>
                            <View style={styles.requestInfo}>
                                <Text style={styles.requestTitle}>Solicitar Nueva Tarjeta</Text>
                                <Text style={styles.requestSubtitle}>Tarjetas físicas o digitales inmediatas</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.benefitGrid}>
                            <View style={styles.benefitCard}>
                                <Zap color="#f59e0b" size={24} />
                                <Text style={styles.benefitTitle}>Cashback 3%</Text>
                                <Text style={styles.benefitDesc}>En todas tus compras digitales</Text>
                            </View>
                            <View style={styles.benefitCard}>
                                <Shield color="#10b981" size={24} />
                                <Text style={styles.benefitTitle}>Protección</Text>
                                <Text style={styles.benefitDesc}>Seguro contra fraudes incluido</Text>
                            </View>
                        </View>
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
    actionBtn: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardsSection: {
        gap: 30,
        marginBottom: 40,
    },
    cardContainer: {
        gap: 15,
    },
    cardControls: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        padding: 15,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
    },
    controlBtn: {
        alignItems: 'center',
        gap: 6,
    },
    controlText: {
        color: '#94a3b8',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    sectionLabel: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    requestSection: {
        marginTop: 10,
    },
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(99,102,241,0.05)',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(99,102,241,0.1)',
        marginBottom: 20,
    },
    requestIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(99,102,241,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    requestInfo: {
        flex: 1,
    },
    requestTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    requestSubtitle: {
        color: '#6366f1',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    },
    benefitGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    benefitCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
        gap: 8,
    },
    benefitTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 4,
    },
    benefitDesc: {
        color: '#475569',
        fontSize: 10,
        fontWeight: 'bold',
        lineHeight: 14,
    }
});
