import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import axios from "axios";
import "../../css/app.css";
import "../../css/NewQuestion.css";
import { InputText } from "primereact/inputtext";
import { maxIdRef } from "../components/SurveyTable";

export default function NewQuestion() {
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState({
        surveyType: null,
        questionGroup: null,
    });

    /**
     * Fetch Questions API
     */
    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
        } catch (error) {
            console.error("There was an error fetching the questions!", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch Survey API
     */
    const getSurveys = async () => {
        try {
            const response = await axios.get("/api/survey");
            setSurveys(response.data);
        } catch (error) {
            console.error("There was an error fetching the surveys!", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch Survey Question Group API
     */
    const getSurveyQuestionGroups = async () => {
        try {
            const response = await axios.get("/api/surveyQuestionGroup");
            setSurveyQuestionGroups(response.data);
        } catch (error) {
            console.error(
                "There was an error fetching the survey question groups!",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
        getSurveys();
        getSurveyQuestionGroups();
    }, []);

    const handleSurveyClick = (survey) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            surveyType: survey.survey_name,
        }));
    };

    const handleQuestionGroupClick = (group) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            questionGroup: group.question_group_name,
        }));
    };

    const exportResponsesToJson = () => {
        const jsonResponse = JSON.stringify(response);
        console.log(jsonResponse);
        // Trigger file download or send it to a server
        const blob = new Blob([jsonResponse], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "responses.json";
        link.click();
    };

    const isFormComplete = () => {
        return (
            response.surveyType !== null &&
            response.questionGroup !== null &&
            questions.length > 0
        ); // Add additional checks as needed
    };

    return (
        <div className="card d-flex justify-content-center">
            <Stepper ref={stepperRef} style={{ flexBasis: "60rem" }}>
                {/* Step 1 - Survey Type */}
                <StepperPanel header="Survey Type">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex font-medium mx-5 h-small"
                            style={{ overflow: "auto" }}
                        >
                            <div className="d-flex flex-column">
                                <h5 className="text-muted">Step 1</h5>
                                <h1>Apa Nama Tipe Survey Anda?</h1>
                                <div
                                    className="d-flex flex-row flex-wrap"
                                    style={{ gap: "25px" }}
                                >
                                    {surveys.map((survey, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleSurveyClick(survey)
                                            }
                                            className={`btn btn-lg m-2 flex-fill ${
                                                response.surveyType ===
                                                survey.survey_name
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            }`}
                                            style={{
                                                height: "100px",
                                                minWidth: "200px",
                                                fontSize: "18px",
                                                borderRadius: "30px",
                                            }}
                                        >
                                            {survey.survey_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex pt-4 justify-content-end mx-5">
                            <Button
                                label="Next"
                                className="rounded"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                disabled={response.surveyType === null}
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </div>
                </StepperPanel>

                {/* Step 2 - Question Group Name */}
                <StepperPanel header="Question Group Name">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-auto d-flex font-medium mx-5"
                            style={{ height: "50vh", overflow: "auto" }}
                        >
                            <div className="d-flex flex-column">
                                <h5 className="text-muted">Step 2</h5>
                                <h1>Apakah Grup {response.surveyType} Anda?</h1>
                                <div
                                    className="d-flex flex-row flex-wrap"
                                    style={{ gap: "25px" }}
                                >
                                    {surveyQuestionGroups
                                        .filter((group) =>
                                            group.question_group_name.includes(
                                                response.surveyType
                                            )
                                        )
                                        .map((group, index) => {
                                            const groupNameAfterDash = group.question_group_name
                                                .substring(
                                                    group.question_group_name.indexOf(
                                                        "-"
                                                    ) + 1
                                                )
                                                .trim();
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        handleQuestionGroupClick(
                                                            group
                                                        )
                                                    }
                                                    className={`btn btn-lg m-2 flex-fill ${
                                                        response.questionGroup ===
                                                        group.question_group_name
                                                            ? "btn-primary"
                                                            : "btn-outline-primary"
                                                    }`}
                                                    style={{
                                                        height: "100px",
                                                        minWidth: "200px",
                                                        fontSize: "18px",
                                                        borderRadius: "30px",
                                                    }}
                                                >
                                                    {groupNameAfterDash}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex pt-4 justify-content-between mx-5">
                            <Button
                                label="Back"
                                className="rounded"
                                icon="pi pi-arrow-left"
                                severity="secondary"
                                onClick={() =>
                                    stepperRef.current.prevCallback()
                                }
                            />
                            <Button
                                label="Next"
                                className="rounded"
                                icon="pi pi-arrow-right"
                                iconPos="right"
                                disabled={response.questionGroup === null}
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </div>
                </StepperPanel>

                {/* Step 3 - Rest of Survey */}
                <StepperPanel header="Add Question">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-column d-flex font-medium mx-5"
                            style={{
                                height: "55vh",
                                overflow: "auto",
                                alignContent: "center",
                            }}
                        >
                            <div
                                className="d-flex flex-column"
                                style={{
                                    alignContent: "center",
                                    textAlign: "left",
                                }}
                            >
                                <h5 className="text-muted">Step 3</h5>
                                <h1>
                                    Tambah Pertanyaan {response.questionGroup}
                                </h1>
                                <div className="d-flex flex-column flex-wrap flex-column align-items-center mt-4">
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_id"
                                                required
                                                style={{ minWidth: "20rem" }}
                                                value={maxIdRef.current}
                                            />
                                            <label
                                                htmlFor="question_id"
                                                className="font-bold"
                                            >
                                                Question ID
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                            />
                                            <label
                                                htmlFor="question_name"
                                                className="font-bold"
                                            >
                                                Question Group ID
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                                value={response.surveyType}
                                            />
                                            <label
                                                htmlFor="survey_name"
                                                className="font-bold"
                                            >
                                                Survey Name
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                                value={response.questionGroup}
                                            />
                                            <label
                                                htmlFor="question_group_name"
                                                className="font-bold"
                                            >
                                                Question Group Name
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                            />
                                            <label
                                                htmlFor="question_name"
                                                className="font-bold"
                                            >
                                                Question Name
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                            />
                                            <label
                                                htmlFor="question_name"
                                                className="font-bold"
                                            >
                                                Question Key
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                            />
                                            <label
                                                htmlFor="question_name"
                                                className="font-bold"
                                            >
                                                Question Type
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                            />
                                            <label
                                                htmlFor="question_name"
                                                className="font-bold"
                                            >
                                                Sequence
                                            </label>
                                        </span>
                                    </div>
                                    <div
                                        className="field"
                                        style={{
                                            marginBottom: "35px",
                                            minWidth: "12rem",
                                        }}
                                    >
                                        <span className="p-float-label">
                                            <InputText
                                                id="question_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                            />
                                            <label
                                                htmlFor="question_name"
                                                className="font-bold"
                                            >
                                                Status
                                            </label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex pt-4 justify-content-start mx-5">
                            <Button
                                label="Back"
                                severity="secondary"
                                className="rounded"
                                icon="pi pi-arrow-left"
                                onClick={() =>
                                    stepperRef.current.prevCallback()
                                }
                            />
                        </div>
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
console.log("current", setTimeout(maxIdRef.current));
