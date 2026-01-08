import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4A90E2',
                tabBarStyle: { backgroundColor: '#F5F5F7' },
                headerStyle: { backgroundColor: '#F5F5F7' },
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Estudiar',
                    tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="repasos"
                options={{
                    title: 'Repasos',
                    tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="errores"
                options={{
                    title: 'Errores',
                    tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="progreso"
                options={{
                    title: 'Progreso',
                    tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="configuracion"
                options={{
                    title: 'Configuración',
                    tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
