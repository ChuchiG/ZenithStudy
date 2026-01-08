import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMindsetStore } from "../../store/mindsetStore";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen() {
    const { effortMinutes, streak } = useMindsetStore();

    const getMastery = (mins: number) => {
        if (mins < 100) return { title: "Novato", icon: "leaf-outline", color: "#4ADE80" };
        if (mins < 500) return { title: "Aprendiz", icon: "bolt-outline", color: "#60A5FA" };
        if (mins < 2000) return { title: "Erudito", icon: "book-outline", color: "#A855F7" };
        return { title: "Sabio", icon: "sunny-outline", color: "#FBBF24" };
    };

    const mastery = getMastery(effortMinutes);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F7" }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
                <Text style={{ fontSize: 36, fontWeight: "bold", color: "#1C1C1E", marginBottom: 32 }}>Evolución</Text>

                <View style={{ flexDirection: "row", marginBottom: 24, gap: 16 }}>
                    <View style={{ flex: 1, backgroundColor: "white", padding: 24, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" }}>
                        <Ionicons name="flame" size={32} color="#F97316" />
                        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 8 }}>{streak}</Text>
                        <Text style={{ color: "#9CA3AF", fontSize: 10, textTransform: "uppercase" }}>Racha Días</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: "white", padding: 24, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" }}>
                        <Ionicons name="time" size={32} color="#4A90E2" />
                        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 8 }}>{effortMinutes}</Text>
                        <Text style={{ color: "#9CA3AF", fontSize: 10, textTransform: "uppercase" }}>Min. Foco</Text>
                    </View>
                </View>

                <View style={{ backgroundColor: "white", padding: 32, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6", marginBottom: 24 }}>
                    <View style={{ backgroundColor: "#F9FAFB", padding: 24, borderRadius: 100, marginBottom: 16 }}>
                        <Ionicons name={mastery.icon as any} size={48} color={mastery.color} />
                    </View>
                    <Text style={{ color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, fontSize: 10, marginBottom: 4 }}>Nivel de Maestría</Text>
                    <Text style={{ fontSize: 30, fontWeight: "bold", color: "#1C1C1E", fontStyle: "italic" }}>{mastery.title}</Text>
                    <View style={{ width: "100%", backgroundColor: "#F3F4F6", height: 8, borderRadius: 4, marginTop: 24, overflow: "hidden" }}>
                        <View style={{ backgroundColor: "#4A90E2", height: "100%", width: `${Math.min((effortMinutes / 2000) * 100, 100)}%` }} />
                    </View>
                </View>

                <View style={{ backgroundColor: "#1C1C1E", padding: 32, borderRadius: 24, marginBottom: 48 }}>
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Mentalidad de hoy</Text>
                    <Text style={{ color: "#9CA3AF", lineHeight: 24 }}>
                        "No busques resultados rápidos. Busca la repetición constante. El genio no nace, se construye bloque de 50 minutos tras bloque de 50 minutos."
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
