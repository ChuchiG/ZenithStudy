import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useMindsetStore } from "../store/mindsetStore";
import { useSettingsStore } from "../store/settingsStore";

export default function Timer() {
    const focusTime = useSettingsStore((state) => state.focusTime);
    const [timeLeft, setTimeLeft] = useState(focusTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [isFocus, setIsFocus] = useState(true);
    const addEffort = useMindsetStore((state) => state.addEffort);

    // Sync timeLeft ONLY when focusTime specifically changes and the timer is not running
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(focusTime * 60);
        }
    }, [focusTime]);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (isFocus) {
                addEffort(focusTime);
                setTimeLeft(10 * 60);
                setIsFocus(false);
            } else {
                setTimeLeft(focusTime * 60);
                setIsFocus(true);
            }
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, isFocus, addEffort, focusTime]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(isFocus ? focusTime * 60 : 10 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 1, color: "#9CA3AF", marginBottom: 8 }}>
                {isFocus ? "Sesión de Enfoque" : "Descanso Vital"}
            </Text>
            <Text style={{ fontSize: 72, fontWeight: "300", color: "#1C1C1E", marginBottom: 32 }}>
                {formatTime(timeLeft)}
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
                <TouchableOpacity
                    onPress={toggleTimer}
                    style={{
                        paddingHorizontal: 40,
                        paddingVertical: 16,
                        borderRadius: 100,
                        backgroundColor: isActive ? "#E5E7EB" : "#4A90E2"
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: isActive ? "#4B5563" : "white" }}>
                        {isActive
                            ? "Pausar"
                            : (isFocus && timeLeft < focusTime * 60) || (!isFocus && timeLeft < 10 * 60)
                                ? "Reanudar"
                                : "Comenzar"
                        }
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={resetTimer}
                    style={{ paddingHorizontal: 24, paddingVertical: 16, borderRadius: 100, borderWidth: 1, borderColor: "#E5E7EB" }}
                >
                    <Text style={{ fontSize: 18, color: "#6B7280" }}>Reiniciar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
