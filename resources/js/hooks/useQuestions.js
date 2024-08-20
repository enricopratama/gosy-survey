import { useState, useEffect } from "react";
import axios from "axios";

export const useQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getQuestions = async () => {
        try {
            const response = await axios.get("/questions");
            setQuestions(response.data);
        } catch (error) {
            console.error("There was an error fetching the questions!", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    return { questions, loading, error, getQuestions };
};
