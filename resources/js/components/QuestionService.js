import axios from "axios";

// Base URLs for the different API endpoints
const QUESTION_API_BASE_URL = "api/questions";
const QUESTION_GROUP_API_BASE_URL = "api/questionGroups";
const SURVEY_API_BASE_URL = "api/surveys";

class QuestionService {
    // Fetch all questions
    getQuestions() {
        return axios.get(QUESTION_API_BASE_URL);
    }

    // Create a new question
    createQuestion(question) {
        return axios.post(QUESTION_API_BASE_URL, question);
    }

    // Fetch a question by its ID
    getQuestionById(questionId) {
        return axios.get(`${QUESTION_API_BASE_URL}/${questionId}`);
    }

    // Update an existing question by its ID
    updateQuestion(question, questionId) {
        return axios.put(`${QUESTION_API_BASE_URL}/${questionId}`, question);
    }

    // Delete a question by its ID
    deleteQuestion(questionId) {
        return axios.delete(`${QUESTION_API_BASE_URL}/${questionId}`);
    }

    // Fetch all survey question groups
    getSurveyQuestionGroups() {
        return axios.get(QUESTION_GROUP_API_BASE_URL);
    }

    // Fetch all surveys
    getSurveys() {
        return axios.get(SURVEY_API_BASE_URL);
    }

    // Fetch survey question group ID based on name
    getQuestionIDMap(questionGroupName) {
        return axios.get(`${QUESTION_GROUP_API_BASE_URL}/${questionGroupName}`);
    }
}

export default new QuestionService();
