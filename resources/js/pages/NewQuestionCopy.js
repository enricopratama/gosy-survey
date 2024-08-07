import React, { useContext, useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Message } from "primereact/message";
import { OverlayPanel } from "primereact/overlaypanel";
import { MaxIdContext } from "../components/MaxIdContext";
import axios from "axios";
import "../../css/app.css";
import "../../css/NewQuestion.css";

export default function NewQuestion() {
    const op = useRef(null);
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customSurvey, setCustomSurvey] = useState("");
    const [customQuestionGroup, setCustomQuestionGroup] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { maxId } = useContext(MaxIdContext); // declare from global var
    const [submittedQuestion, setSubmittedQuestion] = useState(false);
    const [hoveredSurveyType, setHoveredSurveyType] = useState(null);
    const [questionDialog, setQuestionDialog] = useState(false);
    const [questionGroupDialog, setQuestionGroupDialog] = useState(false);
    const [response, setResponse] = useState({
        surveyType: null, // Survey Name
        questionGroup: null, // Question Group Name
        questionId: maxId,
        questionGroupId: null,
        questionKey: null,
        questionType: null,
        sequence: null,
        status: null,
    });

    // Update questionId whenever maxId changes
    useEffect(() => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            questionId: maxId,
        }));
    }, [maxId]);

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
            const response = await axios.get("/api/questionGroups");
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

    const handleCustomSurveySubmit = () => {
        setSubmitted(true);
        if (customSurvey.trim()) {
            handleSurveyClick({ survey_name: customSurvey });
        }
        setQuestionDialog(false);
    };

    const handleCustomQuestionGroupSubmit = () => {
        setSubmittedQuestion(true);
        const additionalString = `${response.surveyType} - `;
        const totalString = additionalString + customQuestionGroup;
        if (customQuestionGroup.trim()) {
            handleQuestionGroupClick({
                question_group_name: totalString,
            });
        }
        setQuestionGroupDialog(false);
    };

    const showDialog = () => {
        setQuestionDialog(true);
    };

    const hideDialog = () => {
        setQuestionDialog(false);
        setCustomSurvey("");
    };

    const showQuestionGroupDialog = () => {
        setQuestionGroupDialog(true);
    };

    const hideQuestionGroupDialog = () => {
        setQuestionGroupDialog(false);
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
                                    {/* Button Options */}
                                    {surveys.map((survey, index) => (
                                        <>
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    handleSurveyClick(survey);
                                                    setSubmitted(false);
                                                }}
                                                onMouseEnter={(e) => {
                                                    op.current.show(e);
                                                    setHoveredSurveyType(
                                                        survey.survey_name
                                                    );
                                                }}
                                                onMouseOut={(e) => {
                                                    op.current.hide(e);
                                                    setHoveredSurveyType(null);
                                                }}
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

                                            {/* Popover Over Button */}
                                            <OverlayPanel ref={op}>
                                                <div>
                                                    <h5>Question Groups:</h5>
                                                    {surveyQuestionGroups
                                                        .filter((group) =>
                                                            group.question_group_name.includes(
                                                                hoveredSurveyType
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
                                                                <div
                                                                    key={index}
                                                                >
                                                                    {
                                                                        groupNameAfterDash
                                                                    }
                                                                </div>
                                                            );
                                                        })}
                                                    {surveyQuestionGroups.filter(
                                                        (group) =>
                                                            group.question_group_name.includes(
                                                                hoveredSurveyType
                                                            )
                                                    ).length === 0 && (
                                                        <div>None</div>
                                                    )}
                                                </div>
                                            </OverlayPanel>
                                        </>
                                    ))}

                                    {/* Tambah Tipe Survey Button */}
                                    <div className="d-flex flex-column m-2 flex-fill">
                                        <button
                                            onClick={() => {
                                                showDialog();
                                                setSubmitted(false);
                                            }}
                                            className={`btn btn-lg ${
                                                !submitted ||
                                                surveys.some(
                                                    (survey) =>
                                                        survey.survey_name ===
                                                        customSurvey
                                                )
                                                    ? "btn-outline-primary"
                                                    : "btn-primary"
                                            }`}
                                            style={{
                                                height: "100px",
                                                fontSize: "18px",
                                                borderRadius: "30px",
                                            }}
                                        >
                                            {!submitted ||
                                            surveys.some(
                                                (survey) =>
                                                    survey.survey_name ===
                                                    customSurvey
                                            ) ? (
                                                <div>
                                                    <i className="pi pi-plus me-2"></i>
                                                    Tambah Tipe Survey
                                                </div>
                                            ) : (
                                                response.surveyType
                                            )}
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
                                            header="Survey Details"
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
                                                    placeholder="Survey [survey name]"
                                                    className={classNames({
                                                        "p-invalid":
                                                            submitted &&
                                                            !customSurvey,
                                                    })}
                                                />

                                                {submitted &&
                                                    !response.surveyType && (
                                                        <>
                                                            <small className="p-error">
                                                                Survey Type is
                                                                required
                                                            </small>
                                                            <Message
                                                                severity="error"
                                                                text="Survey Name is required"
                                                            />
                                                        </>
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
                                    {/* Button Options  */}
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
                                                    onClick={() => {
                                                        handleQuestionGroupClick(
                                                            group
                                                        );
                                                        setSubmittedQuestion(
                                                            false
                                                        );
                                                    }}
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
                                                setSubmittedQuestion(false);
                                            }}
                                            className={`btn btn-lg ${
                                                !submittedQuestion ||
                                                surveyQuestionGroups.some(
                                                    (group) =>
                                                        group.question_group_name ===
                                                        `${response.surveyType} - ${customQuestionGroup}`
                                                )
                                                    ? "btn-outline-primary"
                                                    : "btn-primary"
                                            }`}
                                            style={{
                                                height: "100px",
                                                fontSize: "18px",
                                                borderRadius: "30px",
                                            }}
                                        >
                                            {!submittedQuestion ||
                                            surveyQuestionGroups.some(
                                                (group) =>
                                                    group.question_group_name ===
                                                    `${response.surveyType} - ${customQuestionGroup}`
                                            ) ? (
                                                <div>
                                                    <i className="pi pi-plus me-2"></i>
                                                    Tambah Question Group
                                                </div>
                                            ) : (
                                                response.questionGroup
                                                    .substring(
                                                        response.questionGroup.indexOf(
                                                            "-"
                                                        ) + 1
                                                    )
                                                    .trim()
                                            )}
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
                                                    placeholder={`${response.surveyType} - `}
                                                    onChange={
                                                        onQuestionGroupInputChange
                                                    }
                                                    required
                                                    className={classNames({
                                                        "p-invalid":
                                                            submittedQuestion &&
                                                            !customQuestionGroup,
                                                    })}
                                                />
                                                {submittedQuestion &&
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

                {/* Step 3 - Rest of Survey */}
                <StepperPanel header="Add Question">
                    <div className="d-flex flex-column">
                        <div
                            className="rounded surface-ground flex-column d-flex font-medium mx-5"
                            style={{
                                height: "65vh",
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
                                                id="survey_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                                value={response.surveyType}
                                                disabled
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
                                                id="question_group_name"
                                                required
                                                style={{ minWidth: "20rem" }}
                                                value={response.questionGroup}
                                                disabled
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
                                                id="question_id"
                                                required
                                                style={{ minWidth: "20rem" }}
                                                value={maxId}
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
            </Stepper>
        </div>
    );
}
