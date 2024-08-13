import React, { useEffect } from "react";

const FindIndex = ({ questions, id, onFindIndex }) => {
    // Find the index of the question by ID
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].question_id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // Use effect to find the index when component mounts or id/ questions change
    useEffect(() => {
        const index = findIndexById(id);
        onFindIndex(index); // Callback to return the index
    }, [id, questions, onFindIndex]);

    return null; // This component does not render anything visible
};

FindIndex.defaultProps = {
    questions: [],
    id: null,
    onFindIndex: () => {},
};

export default FindIndex;
