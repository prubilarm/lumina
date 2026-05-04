import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Switch, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { User, Shield, Bell, CircleHelp, Info, LogOut, ChevronRight, Moon, Smartphone, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../../services/api';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        Alert.alert('Cerrar Sesión', '¿Estás seguro que deseas salir de tu cuenta?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => {
                setAuthToken(null);
                router.replace('/login');
            }}
        ]);
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
                        <Text style={styles.brandTag}>LUMINA IDENTITY</Text>
                        <Text style={styles.title}>Mi Perfil</Text>
                    </View>

                    {/* User Profile Info */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatar}>
                            <User color="#fff" size={32} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.full_name || 'Usuario Lumina'}</Text>
                            <Text style={styles.userEmail}>{user?.email || 'email@lumina.bank'}</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>PLATINUM</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Seguridad y Acceso</Text>
                        <SettingItem 
                            icon={<Shield color="#6366f1" size={20} />} 
                            title="Autenticación Biométrica" 
                            type="switch" 
                            value={biometrics} 
                            onValueChange={setBiometrics} 
                        />
                        <SettingItem 
                            icon={<Zap color="#6366f1" size={20} />} 
                            title="Cambiar PIN de Transacción" 
                        />
                        <SettingItem 
                            icon={<Smartphone color="#6366f1" size={20} />} 
                            title="Dispositivos Vinculados" 
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Preferencias</Text>
                        <SettingItem 
                            icon={<Bell color="#f59e0b" size={20} />} 
                            title="Notificaciones Push" 
                            type="switch" 
                            value={notifications} 
                            onValueChange={setNotifications} 
                        />
                        <SettingItem 
                            icon={<Moon color="#f59e0b" size={20} />} 
                            title="Tema del Interfaz" 
                            rightText="Oscuro"
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Soporte</Text>
                        <SettingItem 
                            icon={<CircleHelp color="#94a3b8" size={20} />} 
                            title="Centro de Ayuda" 
                        />
                        <SettingItem 
                            icon={<Info color="#94a3b8" size={20} />} 
                            title="Información Legal" 
                        />
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <LogOut color="#f43f5e" size={20} />
                        <Text style={styles.logoutText}>Cerrar Sesión Segura</Text>
                    </TouchableOpacity>

                    <View style={styles.versionContainer}>
                        <Text style={styles.versionText}>Lumina Bank v1.0.4-beta</Text>
                        <Text style={styles.footerBrand}>Powered by Sentendar Finance</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function SettingItem({ icon, title, type = 'link', value, onValueChange, rightText }: any) {
    return (
        <TouchableOpacity style={styles.settingItem} disabled={type === 'switch'}>
            <View style={styles.settingIcon}>
                {icon}
            </View>
            <Text style={styles.settingTitle}>{title}</Text>
            {type === 'switch' ? (
                <Switch 
                    value={value} 
                    onValueChange={onValueChange}
                    trackColor={{ false: '#1e293b', true: '#6366f1' }}
                    thumbColor={value ? '#fff' : '#475569'}
                />
            ) : (
                <View style={styles.settingRight}>
                    {rightText && <Text style={styles.rightText}>{rightText}</Text>}
                    <ChevronRight color="#475569" size={20} />
                </View>
            )}
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
        padding: 24,
        paddingBottom: 40,
    },
    header: {
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
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
        marginBottom: 35,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        color: '#475569',
        fontSize: 13,
        marginTop: 2,
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: 'rgba(99,102,241,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(99,102,241,0.2)',
    },
    badgeText: {
        color: '#6366f1',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
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
        marginLeft: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        padding: 16,
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rightText: {
        color: '#475569',
        fontSize: 12,
        fontWeight: 'bold',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: 'rgba(244,63,94,0.05)',
        padding: 20,
        borderRadius: 22,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(244,63,94,0.1)',
    },
    logoutText: {
        color: '#f43f5e',
        fontSize: 15,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    versionContainer: {
        alignItems: 'center',
        marginTop: 40,
        gap: 4,
    },
    versionText: {
        color: '#334155',
        fontSize: 11,
        fontWeight: 'bold',
    },
    footerBrand: {
        color: '#1e293b',
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    }
});

