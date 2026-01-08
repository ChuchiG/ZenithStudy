import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../../store/settingsStore';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracionScreen() {
    const { focusTime, setFocusTime } = useSettingsStore();

    const timeOptions = [15, 25, 30, 45, 50, 60, 90];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
                <View style={{ marginBottom: 32 }}>
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 8 }}>Configuración</Text>
                    <Text style={{ color: '#6B7280', fontSize: 16 }}>Personaliza tu experiencia de estudio.</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="timer-outline" size={24} color="#4A90E2" style={{ marginRight: 12 }} />
                        <Text style={styles.sectionTitle}>Tiempo de Enfoque</Text>
                    </View>

                    <Text style={styles.description}>
                        Si llevas tiempo sin estudiar, te recomendamos empezar con periodos más cortos (ej. 25 min) y aumentar gradualmente.
                    </Text>

                    <View style={styles.optionsGrid}>
                        {timeOptions.map((mins) => (
                            <TouchableOpacity
                                key={mins}
                                onPress={() => setFocusTime(mins)}
                                style={[
                                    styles.optionButton,
                                    focusTime === mins && styles.optionButtonActive
                                ]}
                            >
                                <Text style={[
                                    styles.optionText,
                                    focusTime === mins && styles.optionTextActive
                                ]}>
                                    {mins} min
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{ marginTop: 24, padding: 16, backgroundColor: '#EBF5FF', borderRadius: 16 }}>
                    <Text style={{ color: '#2B6CB0', fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
                        "La constancia es más importante que la intensidad al principio."
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    description: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionButtonActive: {
        backgroundColor: '#EBF5FF',
        borderColor: '#4A90E2',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    optionTextActive: {
        color: '#4A90E2',
    },
});
