import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { LayoutDashboard, CreditCard, History, Settings, TrendingUp } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#475569',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#05070A',
          borderTopColor: 'rgba(255,255,255,0.05)',
          height: Platform.OS === 'ios' ? 88 : 75,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 12,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Tarjetas',
          tabBarIcon: ({ color }) => <CreditCard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Invertir',
          tabBarIcon: ({ color }) => <TrendingUp size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <History size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

