import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FeynmanRecorder from './FeynmanRecorder';
import { useCards } from '../hooks/useCards';

interface NewCardModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function NewCardModal({ visible, onClose }: NewCardModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tempAudioUri, setTempAudioUri] = useState<string | null>(null);
    const { addCard } = useCards();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "El título es obligatorio");
            return;
        }

        setIsSaving(true);
        try {
            await addCard(title, description, tempAudioUri);
            setTitle('');
            setDescription('');
            setTempAudioUri(null);
            onClose();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar la tarjeta");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, height: '90%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1C1C1E' }}>Nueva Tarjeta de Estudio</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="black" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{ color: '#9CA3AF', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Título del tema</Text>
                        <TextInput
                            placeholder="Ej: Programación funcional en TS"
                            style={{ backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 16 }}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={{ color: '#9CA3AF', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Notas rápidas (opcional)</Text>
                        <TextInput
                            multiline
                            placeholder="Conceptos clave o puntos a recordar..."
                            style={{ backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, marginBottom: 24, minHeight: 80, fontSize: 16 }}
                            value={description}
                            onChangeText={setDescription}
                        />

                        <View style={{ marginBottom: 32 }}>
                            <Text style={{ color: '#9CA3AF', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 16 }}>Explicación Feynman (Audio)</Text>
                            <FeynmanRecorder
                                onRecordingComplete={(uri) => setTempAudioUri(uri)}
                                isStandalone={false}
                            />
                            {tempAudioUri && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#ECFDF5', padding: 8, borderRadius: 8 }}>
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                    <Text style={{ color: '#065F46', marginLeft: 8, fontSize: 13 }}>Audio capturado con éxito</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={isSaving}
                            style={{
                                backgroundColor: '#111827',
                                paddingVertical: 18,
                                borderRadius: 16,
                                alignItems: 'center',
                                opacity: isSaving ? 0.7 : 1,
                                marginTop: 10
                            }}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                                {isSaving ? "Guardando..." : "Finalizar y Agendar Repaso"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 16, fontSize: 12 }}>
                            Se agendarán repasos automáticamente para mañana, en 3 días, 10 días y 24 días.
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
