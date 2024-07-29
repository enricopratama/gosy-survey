import { useState, useEffect } from "react";
import axios from "axios";

const GetQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [maxId, setMaxId] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("/api/questions");
                setQuestions(response.data);
                const maxId =
                    response.data.length > 0
                        ? Math.max(...response.data.map((q) => q.question_id)) +
                          1
                        : 1;
                setMaxId(maxId);
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

    return { questions, maxId, loading };
};

export default GetQuestions;
