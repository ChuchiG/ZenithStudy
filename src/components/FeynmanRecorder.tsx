import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";

interface FeynmanRecorderProps {
    onRecordingComplete?: (uri: string | null) => void;
    isStandalone?: boolean;
}

export default function FeynmanRecorder({ onRecordingComplete, isStandalone = true }: FeynmanRecorderProps) {
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const [isRecording, setIsRecording] = useState(false);

    async function startRecording() {
        try {
            const { granted } = await requestRecordingPermissionsAsync();
            if (granted) {
                await recorder.prepareToRecordAsync();
                recorder.record();
                setIsRecording(true);
            }
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        try {
            await recorder.stop();
            setIsRecording(false);
            const uri = recorder.uri;
            if (onRecordingComplete) {
                onRecordingComplete(uri);
            }
        } catch (err) {
            console.error("Failed to stop recording", err);
        }
    }

    return (
        <View style={{ backgroundColor: "#F9FAFB", padding: 24, borderRadius: 24, alignItems: "center", borderWidth: 1, borderColor: "#F3F4F6" }}>
            <Text style={{ fontSize: 12, fontWeight: "bold", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 16 }}>MÉTODO FEYNMAN</Text>
            <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isRecording ? "#FEE2E2" : "rgba(74, 144, 226, 0.1)"
                }}
            >
                <Ionicons name={isRecording ? "stop" : "mic"} size={32} color={isRecording ? "#EF4444" : "#4A90E2"} />
            </TouchableOpacity>
            <Text style={{ marginTop: 16, color: "#4B5563", textAlign: "center", fontSize: 14, paddingHorizontal: 16 }}>
                {isRecording ? "Explicando en voz alta..." : "Toca para explicar este concepto como si se lo contaras a un niño."}
            </Text>
        </View>
    );
}
