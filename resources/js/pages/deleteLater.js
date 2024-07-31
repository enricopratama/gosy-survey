import React, { useEffect, useRef, useState } from "react";
import { Stepper, StepperPanel } from "primereact/stepper";
import { Button } from "primereact/button";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

export default function NewQuestionv2() {
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customSurvey, setCustomSurvey] = useState("");
    const [customQuestionGroup, setCustomQuestionGroup] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [questionDialog, setQuestionDialog] = useState(false);

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

    const handleCustomSurveySubmit = () => {
        setSubmitted(true);
        if (customSurvey.trim()) {
            handleSurveyClick({ survey_name: customSurvey });
            setCustomSurvey("");
            setQuestionDialog(false);
        }
    };

    const handleCustomQuestionGroupSubmit = () => {
        setSubmitted(true);
        if (customQuestionGroup.trim()) {
            handleQuestionGroupClick({
                question_group_name: customQuestionGroup,
            });
            setCustomQuestionGroup("");
            setQuestionGroupDialog(false);
        }
    };

    const showDialog = () => {
        setQuestionDialog(true);
        setSubmitted(false);
    };

    const hideDialog = () => {
        setQuestionDialog(false);
        setSubmitted(false);
        setCustomSurvey("");
    };

    const showQuestionGroupDialog = () => {
        setQuestionGroupDialog(true);
        setSubmitted(false);
    };

    const hideQuestionGroupDialog = () => {
        setQuestionGroupDialog(false);
        setSubmitted(false);
        setCustomQuestionGroup("");
    };

    const onInputChange = (e) => {
        setCustomSurvey(e.target.value);
    };

    const onQuestionGroupInputChange = (e) => {
        setCustomQuestionGroup(e.target.value);
    };

    const questionDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2 rounded"
                outlined
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="ms-2 rounded"
                iconPos="left"
                onClick={handleCustomSurveySubmit}
                disabled={!customSurvey.trim()}
            />
        </React.Fragment>
    );

    const questionGroupDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2 rounded"
                outlined
                onClick={hideQuestionGroupDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="ms-2 rounded"
                iconPos="left"
                onClick={handleCustomQuestionGroupSubmit}
                disabled={!customQuestionGroup.trim()}
            />
        </React.Fragment>
    );

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
                                    <div className="d-flex flex-column m-2 flex-fill">
                                        <button
                                            onClick={() => {
                                                showDialog();
                                                setSubmitted(false);
                                            }}
                                            className="btn btn-lg btn-outline-primary mt-2"
                                            style={{
                                                height: "100px",
                                                fontSize: "18px",
                                                borderRadius: "30px",
                                            }}
                                        >
                                            Tambahkan Tipe Survey
                                        </button>
                                        <Dialog
                                            visible={questionDialog}
                                            style={{
                                                width: "32rem",
                                                maxHeight: "90vh",
                                            }}
                                            breakpoints={{
                                                "960px": "75vw",
                                                "641px": "90vw",
                                            }}
                                            header="Question Details"
                                            modal
                                            className="p-fluid"
                                            footer={questionDialogFooter}
                                            onHide={hideDialog}
                                        >
                                            <div
                                                className="field"
                                                style={{ marginBottom: "35px" }}
                                            >
                                                <label
                                                    htmlFor="survey_name"
                                                    className="font-bold"
                                                >
                                                    Survey Type/Name
                                                </label>
                                                <InputText
                                                    id="survey_name"
                                                    value={customSurvey}
                                                    onChange={onInputChange}
                                                    required
                                                    className={classNames({
                                                        "p-invalid":
                                                            submitted &&
                                                            !customSurvey,
                                                    })}
                                                />
                                                {submitted && !customSurvey && (
                                                    <small className="p-error">
                                                        Survey Type is required
                                                    </small>
                                                )}
                                            </div>
                                        </Dialog>
                                    </div>
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

                {/* Step 2 - Question Group */}
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
                                    <div className="d-flex flex-column m-2 flex-fill">
                                        <button
                                            onClick={() => {
                                                showQuestionGroupDialog();
                                                setSubmitted(false);
                                            }}
                                            className="btn btn-lg btn-outline-primary mt-2"
                                            style={{
                                                height: "100px",
                                                fontSize: "18px",
                                                borderRadius: "30px",
                                            }}
                                        >
                                            Tambah Question Group
                                        </button>
                                        <Dialog
                                            visible={questionGroupDialog}
                                            style={{
                                                width: "32rem",
                                                maxHeight: "90vh",
                                            }}
                                            breakpoints={{
                                                "960px": "75vw",
                                                "641px": "90vw",
                                            }}
                                            header="Question Group Details"
                                            modal
                                            className="p-fluid"
                                            footer={questionGroupDialogFooter}
                                            onHide={hideQuestionGroupDialog}
                                        >
                                            <div
                                                className="field"
                                                style={{ marginBottom: "35px" }}
                                            >
                                                <label
                                                    htmlFor="question_group_name"
                                                    className="font-bold"
                                                >
                                                    Question Group Name
                                                </label>
                                                <InputText
                                                    id="question_group_name"
                                                    value={customQuestionGroup}
                                                    onChange={
                                                        onQuestionGroupInputChange
                                                    }
                                                    required
                                                    className={classNames({
                                                        "p-invalid":
                                                            submitted &&
                                                            !customQuestionGroup,
                                                    })}
                                                />
                                                {submitted &&
                                                    !customQuestionGroup && (
                                                        <small className="p-error">
                                                            Question Group Name
                                                            is required
                                                        </small>
                                                    )}
                                            </div>
                                        </Dialog>
                                    </div>
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
                {/* Other Stepper Panels */}
            </Stepper>
        </div>
    );
}
