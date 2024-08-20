import { useState } from "react";
import axios from "axios";

export const useQuestionIDMap = () => {
    const [mapGrpId, setMapGrpId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getQuestionIDMap = async (question_group_name) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/questionGroups/${question_group_name}`
            );
            const questionGroupId = response.data.question_group_id;
            setMapGrpId(questionGroupId);

            return questionGroupId;
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

    return { mapGrpId, loading, error, getQuestionIDMap };
};
