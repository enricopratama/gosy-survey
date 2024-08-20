import { useState, useEffect } from "react";
import axios from "axios";

export const useSurveys = () => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getSurveys = async () => {
        try {
            const response = await axios.get("/api/survey");
            setSurveys(response.data);
        } catch (error) {
            console.error("There was an error fetching the surveys!", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSurveys();
    }, []);

    return { surveys, loading, error, getSurveys };
};
