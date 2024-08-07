import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MaxIdContext = createContext();

export const MaxIdProvider = ({ children }) => {
    const [maxId, setMaxId] = useState(1);
    // const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get("/api/questions");
                const fetchedQuestions = response.data;

                // setQuestions(fetchedQuestions);

                const calculatedMaxId =
                    fetchedQuestions.length > 0
                        ? Math.max(
                              ...fetchedQuestions.map((q) => q.question_id)
                          ) + 1
                        : 1;

                setMaxId(calculatedMaxId);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <MaxIdContext.Provider value={{ maxId, setMaxId }}>
            {children}
        </MaxIdContext.Provider>
    );
};
