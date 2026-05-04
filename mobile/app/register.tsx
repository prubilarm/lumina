import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { User, Mail, Lock, ArrowRight, ArrowLeft, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Protocolo Lumina', 'Para iniciar su vinculación con la red bancaria privada, es imperativo completar todos los campos de identidad.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { 
                full_name: fullName, 
                email, 
                password 
            });
            Alert.alert('Registro Exitoso', 'Sus credenciales han sido generadas y validadas por el núcleo Lumina. Proceda a autorizar su acceso.', [
                { text: 'Ir al Terminal', onPress: () => router.replace('/login') }
            ]);
        } catch (err: any) {
            Alert.alert('Error de Validación', err.response?.data?.message || 'Hubo un problema al procesar su solicitud de ingreso a la red.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#020408', '#0f172a', '#05070A']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Orbs */}
            <View style={[styles.orb, { top: -100, left: -100, backgroundColor: 'rgba(99, 102, 241, 0.15)' }]} />
            <View style={[styles.orb, { bottom: -150, right: -100, backgroundColor: 'rgba(34, 211, 238, 0.1)' }]} />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <ArrowLeft color="#fff" size={24} />
                        </TouchableOpacity>

                        <View style={styles.header}>
                            <View style={styles.logoWrapper}>
                                <LinearGradient
                                    colors={['#6366f1', '#4f46e5']}
                                    style={styles.logoContainer}
                                >
                                    <Zap color="#fff" size={28} fill="currentColor" />
                                </LinearGradient>
                                <View style={styles.logoRing} />
                            </View>
                            <Text style={styles.title}>Vinculación Lumina</Text>
                            <View style={styles.badgeContainer}>
                                <Text style={styles.subtitle}>SOLICITUD DE CREDENCIALES PRIVADAS</Text>
                            </View>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Datos de Ciudadanía Digital</Text>
                                
                                <View style={styles.glassInputWrapper}>
                                    <View style={styles.inputIconWrapper}>
                                        <User color="#6366f1" size={20} />
                                    </View>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Identidad Legal Completa"
                                        placeholderTextColor="#475569"
                                        value={fullName}
                                        onChangeText={setFullName}
                                    />
                                </View>

                                <View style={styles.glassInputWrapper}>
                                    <View style={styles.inputIconWrapper}>
                                        <Mail color="#6366f1" size={20} />
                                    </View>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Canal de Comunicación (Email)"
                                        placeholderTextColor="#475569"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.glassInputWrapper}>
                                    <View style={styles.inputIconWrapper}>
                                        <Lock color="#6366f1" size={20} />
                                    </View>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Clave de Encriptación de Cuenta"
                                        placeholderTextColor="#475569"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={[styles.registerButton, (loading || !email || !password || !fullName) && styles.registerButtonDisabled]} 
                                onPress={handleRegister}
                                disabled={loading || !email || !password || !fullName}
                            >
                                <LinearGradient
                                    colors={['#6366f1', '#4f46e5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
                                />
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Text style={styles.registerButtonText}>Vincular mi Identidad</Text>
                                        <ArrowRight color="#fff" size={18} strokeWidth={3} />
                                    </>
                                )}
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>¿Ya posee credenciales? </Text>
                                <TouchableOpacity onPress={() => router.push('/login')}>
                                    <Text style={styles.loginText}>Acceso de Cliente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.termsContainer}>
                            <Text style={styles.termsText}>
                                Al vincularse, usted autoriza el tratamiento de datos bajo los protocolos de <Text style={styles.linkText}>Seguridad Lumina</Text> y la <Text style={styles.linkText}>Jurisdicción de Sentendar Bank</Text>.
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    orb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.5,
    },
    scrollContent: {
        padding: 30,
        paddingTop: Platform.OS === 'ios' ? 20 : 10,
    },
    backButton: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 45,
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    logoRing: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.2)',
        zIndex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1.5,
        marginBottom: 10,
    },
    badgeContainer: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 9,
        fontWeight: '900',
        marginTop: 0,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 16,
    },
    label: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
        marginLeft: 4,
    },
    glassInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 22,
        height: 68,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 4,
    },
    inputIconWrapper: {
        width: 60,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    registerButton: {
        height: 68,
        borderRadius: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginTop: 15,
        overflow: 'hidden',
    },
    registerButtonDisabled: {
        opacity: 0.5,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loginText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
    },
    termsContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    termsText: {
        color: '#334155',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#6366f1',
        fontWeight: '900',
    }
});
