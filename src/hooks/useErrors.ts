import { useState, useCallback } from "react";
import { db } from "../database/db";

export interface StudyError {
    id: number;
    problem: string;
    diagnosis: string;
    solution: string;
    status: "active" | "resolved";
    stage: number;
    nextReviewDate: string | null;
    createdAt: string;
}

export function useErrors() {
    const [errors, setErrors] = useState<StudyError[]>([]);

    const fetchErrors = useCallback(() => {
        const result = db.getAllSync<StudyError>("SELECT * FROM errors ORDER BY createdAt DESC");
        setErrors(result);
    }, []);

    const getNextReviewDate = (stage: number) => {
        const now = new Date();
        const intervals = [1, 3, 7, 30]; // Morning, 3 days, 1 week, 1 month
        if (stage >= intervals.length) return null;
        now.setDate(now.getDate() + intervals[stage]);
        return now.toISOString();
    };

    const addError = (problem: string, diagnosis: string, solution: string) => {
        const now = new Date().toISOString();
        const nextReview = getNextReviewDate(0);
        db.runSync(
            "INSERT INTO errors (problem, diagnosis, solution, createdAt, nextReviewDate, stage) VALUES (?, ?, ?, ?, ?, ?)",
            [problem, diagnosis, solution, now, nextReview, 0]
        );
        fetchErrors();
    };

    const resolveError = (id: number) => {
        db.runSync("UPDATE errors SET status = \"resolved\" WHERE id = ?", [id]);
        fetchErrors();
    };

    const advanceError = (id: number, currentStage: number) => {
        const nextStage = currentStage + 1;
        const nextReview = getNextReviewDate(nextStage);
        if (nextReview === null) {
            db.runSync("UPDATE errors SET status = \"resolved\", stage = ? WHERE id = ?", [nextStage, id]);
        } else {
            db.runSync("UPDATE errors SET stage = ?, nextReviewDate = ? WHERE id = ?", [nextStage, nextReview, id]);
        }
        fetchErrors();
    };

    return { errors, fetchErrors, addError, resolveError, advanceError };
}
