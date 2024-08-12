import { useState, useEffect } from "react";
import axios from "axios";

const GetQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("/api/questions");
                setQuestions(response.data);
            } catch (error) {
                console.error(
                    "There was an error fetching the questions!",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return { questions, loading };
};

export default GetQuestions;
