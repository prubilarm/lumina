import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Share2, History, FileText, Zap, CreditCard as CardIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface PlasticCardProps {
    account: any;
    isCredit?: boolean;
    isBalanceHidden?: boolean;
    onAction?: (type: string) => void;
    hideActions?: boolean;
}

const PlasticCard: React.FC<PlasticCardProps> = ({ 
    account, 
    isCredit = false, 
    isBalanceHidden = false, 
    onAction, 
    hideActions = false 
}) => {
    const balance = parseFloat(account.balance || 0).toLocaleString('es-CL');
    const displayBalance = isBalanceHidden ? '••••••' : `$${balance}`;
    const accountNumber = account.account_number || '---';
    const cardType = isCredit ? 'Tarjeta de Crédito' : 'Tarjeta de Débito';
    
    const styles = isCredit ? darkStyles : lightStyles;

    return (
        <View style={[styles.cardContainer, { width: width - 48 }]}>
            {isCredit && (
                <LinearGradient
                    colors={['#1a1a1a', '#2a2a2a', '#0a0a0a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            )}
            {!isCredit && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#f8fafc' }]} />
            )}
            
            {/* Top Row */}
            <View style={styles.topRow}>
                <View>
                    <View style={styles.accountHeader}>
                        <Text style={styles.accountName}>
                            {account.name || (isCredit ? 'Lumina Platinum' : 'Cuenta Corriente')}
                        </Text>
                        <Text style={styles.accountNumber}>{accountNumber}</Text>
                    </View>
                    <Text style={styles.cardTypeLabel}>{cardType}</Text>
                </View>
                <TouchableOpacity style={styles.shareButton}>
                    <Share2 size={18} color={isCredit ? 'rgba(255,255,255,0.4)' : '#94a3b8'} />
                </TouchableOpacity>
            </View>

            {/* Middle Row */}
            <View style={styles.middleRow}>
                <Text style={styles.balanceText}>{displayBalance}</Text>
                <Text style={styles.balanceLabel}>Saldo disponible</Text>
            </View>

            {/* Bottom Row Actions */}
            {!hideActions && (
                <View style={styles.actionsRow}>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.primaryBtn]}
                        onPress={() => onAction && onAction('movimientos')}
                    >
                        <History size={16} color="#fff" />
                        <Text style={styles.primaryBtnText}>Movimientos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionBtn, styles.secondaryBtn]}
                        onPress={() => onAction && onAction('cartolas')}
                    >
                        <FileText size={16} color={isCredit ? '#fff' : '#3b5998'} />
                        <Text style={isCredit ? styles.secondaryBtnTextDark : styles.secondaryBtnTextLight}>Cartolas</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.statusGroup}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Servicio Operativo</Text>
                </View>
                <Text style={styles.statusText}>Cuenta Activa</Text>
            </View>

            {/* Decorative Background Icon */}
            <View style={styles.decorativeIconContainer}>
                {isCredit ? (
                    <CardIcon size={120} color="rgba(255,255,255,0.03)" />
                ) : (
                    <Zap size={120} color="rgba(15,23,42,0.03)" />
                )}
            </View>
        </View>
    );
};

const commonStyles = StyleSheet.create({
    cardContainer: {
        height: 240,
        borderRadius: 32,
        padding: 24,
        justifyContent: 'space-between',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        marginHorizontal: 4,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 10,
    },
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    accountName: {
        fontSize: 14,
        fontWeight: '900',
    },
    accountNumber: {
        fontSize: 10,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    cardTypeLabel: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 2,
    },
    shareButton: {
        padding: 8,
    },
    middleRow: {
        zIndex: 10,
    },
    balanceText: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },
    balanceLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 2,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        zIndex: 10,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: '#6366f1',
    },
    primaryBtnText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        opacity: 0.6,
        zIndex: 10,
    },
    statusGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
    },
    statusText: {
        fontSize: 8,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    decorativeIconContainer: {
        position: 'absolute',
        bottom: -30,
        right: -30,
    },
});

const darkStyles = StyleSheet.create({
    ...commonStyles,
    accountName: { ...commonStyles.accountName, color: '#fff' },
    accountNumber: { ...commonStyles.accountNumber, color: 'rgba(255,255,255,0.4)' },
    cardTypeLabel: { ...commonStyles.cardTypeLabel, color: '#818cf8' },
    balanceText: { ...commonStyles.balanceText, color: '#fff' },
    balanceLabel: { ...commonStyles.balanceLabel, color: 'rgba(255,255,255,0.4)' },
    secondaryBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    secondaryBtnTextDark: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusText: { ...commonStyles.statusText, color: '#fff' },
    footer: { ...commonStyles.footer, borderTopColor: 'rgba(255,255,255,0.1)' },
});

const lightStyles = StyleSheet.create({
    ...commonStyles,
    accountName: { ...commonStyles.accountName, color: '#0f172a' },
    accountNumber: { ...commonStyles.accountNumber, color: '#64748b' },
    cardTypeLabel: { ...commonStyles.cardTypeLabel, color: '#64748b' },
    balanceText: { ...commonStyles.balanceText, color: '#0f172a' },
    balanceLabel: { ...commonStyles.balanceLabel, color: '#64748b' },
    primaryBtn: {
        backgroundColor: '#3b5998',
    },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: '#3b5998',
    },
    secondaryBtnTextLight: {
        color: '#3b5998',
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusText: { ...commonStyles.statusText, color: '#0f172a' },
});

export default PlasticCard;
