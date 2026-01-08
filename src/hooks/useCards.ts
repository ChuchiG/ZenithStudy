import { useState, useCallback } from "react";
import { db } from "../database/db";
import * as FileSystem from 'expo-file-system';

export interface StudyCard {
    id: number;
    title: string;
    description: string;
    audioUri: string | null;
    nextReviewDate: string;
    stage: number;
    status: "active" | "mastered";
    createdAt: string;
}

export function useCards() {
    const [cards, setCards] = useState<StudyCard[]>([]);

    const fetchCards = useCallback(() => {
        const result = db.getAllSync<StudyCard>("SELECT * FROM cards ORDER BY createdAt DESC");
        setCards(result);
    }, []);

    const getNextReviewDate = (stage: number) => {
        const now = new Date();
        const intervals = [1, 3, 10, 24]; // 1, 3, 10, 24 days
        if (stage >= intervals.length) return null;
        now.setDate(now.getDate() + intervals[stage]);
        return now.toISOString();
    };

    const addCard = async (title: string, description: string, tempAudioUri: string | null) => {
        const now = new Date().toISOString();
        const nextReview = getNextReviewDate(0) || now; // Fallback to now if somehow intervals fail
        let finalAudioUri = null;

        if (tempAudioUri) {
            const fileName = `feynman_${Date.now()}.m4a`;

            // SDK 54+ uses the new Paths API. Fallback to documentDirectory for compatibility.
            // @ts-ignore
            const docDir = (FileSystem as any).Paths?.document?.uri || FileSystem.documentDirectory;

            if (!docDir) {
                console.error("No se pudo encontrar el directorio de documentos. Keys:", Object.keys(FileSystem));
                throw new Error("Error de configuración del sistema de archivos.");
            }

            finalAudioUri = `${docDir}${fileName}`;
            await FileSystem.copyAsync({
                from: tempAudioUri,
                to: finalAudioUri
            });
        }

        db.runSync(
            "INSERT INTO cards (title, description, audioUri, createdAt, nextReviewDate, stage) VALUES (?, ?, ?, ?, ?, ?)",
            [title, description, finalAudioUri, now, nextReview, 0]
        );
        fetchCards();
        return true;
    };

    const advanceCard = (id: number, currentStage: number) => {
        const nextStage = currentStage + 1;
        const nextReview = getNextReviewDate(nextStage);

        if (nextReview === null) {
            db.runSync("UPDATE cards SET status = 'mastered', stage = ? WHERE id = ?", [nextStage, id]);
        } else {
            db.runSync("UPDATE cards SET stage = ?, nextReviewDate = ? WHERE id = ?", [nextStage, nextReview, id]);
        }
        fetchCards();
    };

    const deleteCard = async (id: number, audioUri: string | null) => {
        if (audioUri) {
            try {
                await FileSystem.deleteAsync(audioUri, { idempotent: true });
            } catch (e) {
                console.error("Error deleting audio file", e);
            }
        }
        db.runSync("DELETE FROM cards WHERE id = ?", [id]);
        fetchCards();
    };

    return { cards, fetchCards, addCard, advanceCard, deleteCard };
}
