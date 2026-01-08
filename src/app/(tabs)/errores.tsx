import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useErrors } from "../../hooks/useErrors";
import { Ionicons } from "@expo/vector-icons";

export default function ErrorScreen() {
    const { errors, fetchErrors, addError, resolveError } = useErrors();
    const [modalVisible, setModalVisible] = useState(false);
    const [problem, setProblem] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [solution, setSolution] = useState("");

    useEffect(() => {
        fetchErrors();
    }, []);

    const handleSave = () => {
        if (!problem || !diagnosis || !solution) return;
        addError(problem, diagnosis, solution);
        setModalVisible(false);
        setProblem("");
        setDiagnosis("");
        setSolution("");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F7" }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                    <Text style={{ fontSize: 36, fontWeight: "bold", color: "#1C1C1E" }}>Errores</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{ backgroundColor: "#F97316", padding: 12, borderRadius: 24 }}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={errors}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                backgroundColor: "white",
                                padding: 24,
                                borderRadius: 24,
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: "#F3F4F6",
                                opacity: item.status === "resolved" ? 0.5 : 1
                            }}
                        >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: "#9CA3AF", textTransform: "uppercase", fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>Problema</Text>
                                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1C1C1E" }}>{item.problem}</Text>
                                </View>
                                {item.status === "active" && (
                                    <TouchableOpacity onPress={() => resolveError(item.id)}>
                                        <Ionicons name="checkmark-circle-outline" size={28} color="#4ADE80" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ color: "#9CA3AF", textTransform: "uppercase", fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>¿Por qué falló?</Text>
                                <Text style={{ color: "#4B5563" }}>{item.diagnosis}</Text>
                            </View>
                            <View>
                                <Text style={{ color: "#9CA3AF", textTransform: "uppercase", fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>Solución</Text>
                                <Text style={{ color: "#4A90E2", fontWeight: "500" }}>{item.solution}</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 80 }}>
                            <Ionicons name="search-outline" size={64} color="#E5E7EB" />
                            <Text style={{ color: "#9CA3AF", marginTop: 16, textAlign: "center" }}>
                                No has registrado errores aún. El error es el primer paso hacia la maestría.
                            </Text>
                        </View>
                    }
                />
            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
                    <View style={{ backgroundColor: "white", borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, height: "85%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Nuevo Error</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={28} color="black" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput
                                placeholder="Problema original"
                                style={{ backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 16 }}
                                value={problem}
                                onChangeText={setProblem}
                            />
                            <TextInput
                                placeholder="¿Por qué falló? (Diagnóstico)"
                                style={{ backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 16 }}
                                value={diagnosis}
                                onChangeText={setDiagnosis}
                            />
                            <TextInput
                                multiline
                                placeholder="Solución explicada paso a paso"
                                style={{ backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 32, minHeight: 100 }}
                                value={solution}
                                onChangeText={setSolution}
                            />
                            <TouchableOpacity
                                onPress={handleSave}
                                style={{ backgroundColor: "#1C1C1E", paddingVertical: 16, borderRadius: 12, alignItems: "center" }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Guardar Error</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
