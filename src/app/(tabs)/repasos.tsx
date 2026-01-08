import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCards, StudyCard } from "../../hooks/useCards";
import { Ionicons } from "@expo/vector-icons";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { es } from 'date-fns/locale';
import { useAudioPlayer, createAudioPlayer } from 'expo-audio';

export default function ReviewScreen() {
    const [activeTab, setActiveTab] = useState<'tarjetas' | 'calendario'>('tarjetas');
    const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month');
    const [selectedCard, setSelectedCard] = useState<StudyCard | null>(null);
    const { cards, fetchCards, advanceCard, deleteCard } = useCards();
    const [player, setPlayer] = useState<any>(null);

    useEffect(() => {
        fetchCards();
    }, []);

    async function playSound(uri: string) {
        try {
            if (player) {
                player.play(); // Or replace if different URI
            } else {
                const newPlayer = createAudioPlayer(uri);
                setPlayer(newPlayer);
                newPlayer.play();
            }
        } catch (e) {
            Alert.alert("Error", "No se pudo reproducir el audio");
        }
    }

    const renderCards = () => (
        <FlatList
            data={cards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={{ backgroundColor: "white", padding: 24, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: "#F3F4F6", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}>
                    <TouchableOpacity onPress={() => setSelectedCard(item)}>
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ color: "#9CA3AF", textTransform: "uppercase", fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>Concepto</Text>
                            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}>{item.title}</Text>
                            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                                Siguiente repaso: {format(new Date(item.nextReviewDate), "d 'de' MMMM", { locale: es })}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => advanceCard(item.id, item.stage)}
                            style={{ flex: 1, backgroundColor: "#111827", paddingVertical: 14, borderRadius: 12, alignItems: "center" }}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>¡Repasar!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert("Eliminar", "¿Estás seguro de eliminar esta tarjeta?", [
                                    { text: "Cancelar", style: "cancel" },
                                    { text: "Eliminar", style: "destructive", onPress: () => deleteCard(item.id, item.audioUri) }
                                ]);
                            }}
                            style={{ backgroundColor: "#F9FAFB", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#F3F4F6" }}
                        >
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            ListEmptyComponent={
                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 80 }}>
                    <Ionicons name="sparkles-outline" size={64} color="#E5E7EB" />
                    <Text style={{ color: "#9CA3AF", marginTop: 16, textAlign: "center", fontSize: 16 }}>
                        No tienes tarjetas activas.{"\n"}¡Añade algo nuevo en Estudio!
                    </Text>
                </View>
            }
        />
    );

    const renderCalendar = () => {
        const now = new Date();
        let days: Date[] = [];

        if (calendarView === 'month') {
            days = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
        } else if (calendarView === 'week') {
            days = eachDayOfInterval({ start: startOfWeek(now), end: endOfWeek(now) });
        } else {
            days = [now];
        }

        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
                    {(['day', 'week', 'month'] as const).map((v) => (
                        <TouchableOpacity
                            key={v}
                            onPress={() => setCalendarView(v)}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 20,
                                backgroundColor: calendarView === v ? '#4A90E2' : 'white',
                                borderWidth: calendarView === v ? 0 : 1,
                                borderColor: '#E5E7EB'
                            }}
                        >
                            <Text style={{ color: calendarView === v ? 'white' : '#6B7280', fontSize: 13, fontWeight: '600' }}>
                                {v === 'day' ? 'Hoy' : v === 'week' ? 'Semana' : 'Mes'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 20, color: '#111827', textTransform: 'capitalize' }}>
                        {format(now, 'MMMM yyyy', { locale: es })}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {days.map((day) => {
                            const reviewsToday = cards.filter(c => isSameDay(new Date(c.nextReviewDate), day) && c.status === 'active');
                            const isToday = isSameDay(day, now);
                            return (
                                <View key={day.toString()} style={{ width: '14.28%', alignItems: 'center', marginBottom: 20 }}>
                                    <View style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: isToday ? '#4A90E2' : 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            color: isToday ? 'white' : '#374151',
                                            fontWeight: isToday ? 'bold' : '500'
                                        }}>
                                            {format(day, 'd')}
                                        </Text>
                                    </View>
                                    {reviewsToday.length > 0 && (
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316', marginTop: 4 }} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={{ marginTop: 32, marginBottom: 40 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>Próximos Repasos</Text>
                    {cards
                        .filter(c => c.status === 'active')
                        .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
                        .slice(0, 5)
                        .map(card => (
                            <TouchableOpacity
                                key={card.id}
                                onPress={() => setSelectedCard(card)}
                                style={{ backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center' }}
                            >
                                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <Ionicons name="calendar" size={20} color="#8B5CF6" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#111827' }}>{card.title}</Text>
                                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{format(new Date(card.nextReviewDate), "eeee d 'de' MMMM", { locale: es })}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                            </TouchableOpacity>
                        ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F7" }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                    <Text style={{ fontSize: 36, fontWeight: "bold", color: "#1C1C1E" }}>Muro</Text>
                    <View style={{ backgroundColor: 'white', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' }}>
                        <Ionicons name="filter" size={20} color="#1C1C1E" />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 4, borderRadius: 16, marginBottom: 32 }}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('tarjetas')}
                        style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: activeTab === 'tarjetas' ? 'white' : 'transparent', alignItems: 'center', ... (activeTab === 'tarjetas' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 } : {}) }}
                    >
                        <Text style={{ fontWeight: 'bold', color: activeTab === 'tarjetas' ? '#111827' : '#64748B' }}>Tarjetas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('calendario')}
                        style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: activeTab === 'calendario' ? 'white' : 'transparent', alignItems: 'center', ... (activeTab === 'calendario' ? { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 } : {}) }}
                    >
                        <Text style={{ fontWeight: 'bold', color: activeTab === 'calendario' ? '#111827' : '#64748B' }}>Calendario</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'tarjetas' ? renderCards() : renderCalendar()}
            </View>

            <Modal visible={!!selectedCard} animationType="slide" transparent={true}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, height: '80%' }}>
                        {selectedCard && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#4A90E2', textTransform: 'uppercase' }}>Detalle de Tarjeta</Text>
                                    <TouchableOpacity onPress={() => setSelectedCard(null)}>
                                        <Ionicons name="close-circle" size={32} color="#E5E7EB" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>{selectedCard.title}</Text>
                                <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 32 }}>Repasado {selectedCard.stage} veces • Estado: {selectedCard.status === 'active' ? 'En curso' : 'Dominado'}</Text>

                                <View style={{ backgroundColor: '#F9FAFB', padding: 24, borderRadius: 24, marginBottom: 32 }}>
                                    <Text style={{ color: '#9CA3AF', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Notas</Text>
                                    <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24 }}>{selectedCard.description || "Sin notas adicionales."}</Text>
                                </View>

                                {selectedCard.audioUri && (
                                    <View style={{ marginBottom: 40 }}>
                                        <Text style={{ color: '#9CA3AF', textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', marginBottom: 16 }}>Escuchar Explicación</Text>
                                        <TouchableOpacity
                                            onPress={() => playSound(selectedCard.audioUri!)}
                                            style={{ backgroundColor: '#EEF2FF', padding: 24, borderRadius: 24, flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#4A90E2', alignItems: 'center', justifyContent: 'center' }}>
                                                <Ionicons name="play" size={24} color="white" />
                                            </View>
                                            <View style={{ marginLeft: 16 }}>
                                                <Text style={{ fontWeight: 'bold', color: '#4338CA' }}>Reproducir Método Feynman</Text>
                                                <Text style={{ fontSize: 12, color: '#6366F1' }}>Audio guardado en el sistema</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                <TouchableOpacity
                                    onPress={() => {
                                        advanceCard(selectedCard.id, selectedCard.stage);
                                        setSelectedCard(null);
                                    }}
                                    style={{ backgroundColor: '#111827', paddingVertical: 18, borderRadius: 16, alignItems: 'center' }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Confirmar Repaso Exitoso</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
