import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Timer from '../../components/Timer';
import FeynmanRecorder from '../../components/FeynmanRecorder';
import NewCardModal from '../../components/NewCardModal';
import { Ionicons } from '@expo/vector-icons';

export default function StudyScreen() {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 48 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#1C1C1E' }}>Estudio</Text>
                        <Text style={{ color: '#6B7280', marginTop: 8 }}>Aisla el ruido y domina tu mente.</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: '#FFFFFF', padding: 40, borderRadius: 24, marginBottom: 32, borderWidth: 1, borderColor: '#F3F4F6' }}>
                    <Timer />
                </View>

                <View style={{ backgroundColor: '#FFFFFF', padding: 24, borderRadius: 24, marginBottom: 32, borderStyle: 'dashed', borderWidth: 2, borderColor: '#4A90E2', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Añadir Tarjeta</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{ backgroundColor: '#4A90E2', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}
                    >
                        <Ionicons name="add" size={32} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 16, alignItems: 'center', marginBottom: 48 }}>
                    <Text style={{ color: '#9CA3AF', textAlign: 'center', fontStyle: 'italic' }}>
                        "Tu muro de conocimiento se construye con silencio y precision."
                    </Text>
                </View>
            </ScrollView>

            <NewCardModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}
