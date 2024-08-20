import { useState, useEffect } from "react";
import axios from "axios";

export const useSurveyQuestionGroups = () => {
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getSurveyQuestionGroups = async () => {
        try {
            const response = await axios.get("/questionGroups");
            setSurveyQuestionGroups(response.data);
        } catch (error) {
            console.error(
                "There was an error fetching the survey question groups!",
                error
            );
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSurveyQuestionGroups();
    }, []);

    return { surveyQuestionGroups, loading, error, getSurveyQuestionGroups };
};
