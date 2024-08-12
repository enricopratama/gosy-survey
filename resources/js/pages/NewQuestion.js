import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Message } from "primereact/message";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { FloatLabel } from "primereact/floatlabel";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import "../../css/app.css";
import "../../css/NewQuestion.css";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

export default function NewQuestion() {
    const op = useRef(null);
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState([]);
    const toast = useRef(null);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customSurvey, setCustomSurvey] = useState("");
    const [customQuestionGroup, setCustomQuestionGroup] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submittedQuestion, setSubmittedQuestion] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState(null);
    const [hoveredSurveyType, setHoveredSurveyType] = useState(null);
    const [questionDialog, setQuestionDialog] = useState(false);
    const [editQuestionDialog, setEditQuestionDialog] = useState(false);
    const [questionGroupDialog, setQuestionGroupDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [editState, setEditState] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);
    const [deleteQuestionsDialog, setDeleteQuestionsDialog] = useState(false);
    const dt = useRef(null);
    const [mapGrpId, setMapGrpId] = useState(null);
    const [response, setResponse] = useState({
        survey_name: null,
        question_group_name: "",
        question_group_id: mapGrpId,
        question_key: "",
        question_type: "",
        question_name: "",
        sequence: null,
        data_status: null,
    });
    const [editedQuestion, setEditedQuestion] = useState({
        survey_name: null,
        question_group_name: "",
        question_group_id: mapGrpId,
        question_key: "",
        question_type: "",
        question_name: "",
        sequence: null,
        data_status: null,
    });
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        question_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    // const onInputChange = (e, name) => {
    //     const val = (e.target && e.target.value) || "";
    //     let _question = { ...question };
    //     _question[`${name}`] = val;
    //     _question;
    // };

    // const onInputNumberChange = (e, name) => {
    //     const val = e.value || 0;
    //     let _question = { ...question };
    //     _question[`${name}`] = val;
    //     setQuestion(_question);
    // };

    // const handleTypeChange = (e) => {
    //     setResponse((prev) => ({ ...prev, question_type: e.value }));
    // };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _response = { ...response };
        _response[`${name}`] = val;
        setResponse(_response);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _response = { ...response };
        _response[`${name}`] = val;
        setResponse(_response);
    };

    const questionTypes = ["Text", "Choice", "Checkboxes", "Dropdown"];

    /**
     * Initialise an empty question
     */
    const initialEmptyQuestion = {
        question_key: "",
        question_group_id: null,
        sequence: null,
        question_name: "",
        question_type: "",
        data_status: null,
    };

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
     * Fetch Survey Question Group ID based on Name API
     */
    const getQuestionIDMap = async (question_group_name) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `/api/questionGroups/${question_group_name}`
            );
            const questionGroupId = response.data.question_group_id;
            setMapGrpId(questionGroupId);

            // Update response with new question_group_id
            setResponse((prevResponse) => ({
                ...prevResponse,
                question_group_id: questionGroupId,
            }));
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
        if (response.question_group_name) {
            getQuestionIDMap(response.question_group_name);
        }
    }, [response.question_group_name]);

    const filterQuestionsByGroupName = () => {
        if (response.question_group_name) {
            const filteredQuestions = questions.filter((question) => {
                return (
                    question.question_group_name &&
                    question.question_group_name.includes(
                        response.question_group_name
                    )
                );
            });
            setFilteredQuestions(filteredQuestions);
        } else {
            setFilteredQuestions([]);
        }
    };

    useEffect(() => {
        getQuestions();
        getSurveys();
        getSurveyQuestionGroups();
    }, []);

    useEffect(() => {
        filterQuestionsByGroupName();
    }, [questions, response.question_group_name, surveyQuestionGroups]);

    const handleSurveyClick = (survey) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            survey_name: survey.survey_name,
        }));
    };

    const handleQuestionGroupClick = (group) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            question_group_name: group.question_group_name,
        }));
    };

    const handleCustomSurveySubmit = () => {
        setSubmitted(true);
        if (customSurvey.trim()) {
            handleSurveyClick({ survey_name: customSurvey });
        }
        setQuestionDialog(false);
    };

    const confirmEditQuestion = async (rowData) => {
        const url = `/editQuestion/${rowData.question_id}`;
        const data = { ...rowData };

        setLoading(true);

        try {
            const response = await axios.put(url, data);

            console.log("Question updated successfully:", response.data);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Question updated successfully.",
                life: 3000,
            });

            fetchQuestions();
        } catch (error) {
            console.error("Error updating question:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update question.",
                life: 3000,
            });
        }
    };

    const saveQuestion = async () => {
        setSubmitted(true);

        if (response.question_name.trim()) {
            let _questions = [...questions];
            let _response = { ...response };

            if (_response.question_id) {
                const index = findIndexById(_response.question_id);
                if (index >= 0) {
                    _questions[index] = _response;
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Question Updated",
                        life: 2000,
                    });
                } else {
                    _questions.push(_response);
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Question Created",
                        life: 2000,
                    });
                }
            }

            console.log("Current Added Question:", _response);
            var formData = new FormData();
            formData.append("question_group_id", _response.question_group_id);
            formData.append("question_name", _response.question_name);
            formData.append("question_key", _response.question_key);
            formData.append("question_type", _response.question_type);
            formData.append("sequence", _response.sequence);
            formData.append("status", _response.status);
            formData.append("data_status", _response.data_status);
            var url = "/addQuestion";
            var result = await axios({
                method: "post",
                url: url,
                data: formData,
            });
            setQuestions(_questions);
            setQuestionDialog(false);
            setResponse((prevResponse) => ({
                ...prevResponse,
                question_key: "",
                question_type: "",
                question_name: "",
                sequence: null,
                data_status: null,
            }));
            setEditState(false);
            getQuestions();
        }
    };

    const handleCustomQuestionGroupSubmit = () => {
        setSubmittedQuestion(true);
        const additionalString = `${response.survey_name} - `;
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
        setEditState(false);
    };

    const hideEditDialog = () => {
        setEditQuestionDialog(false);
        setEditState(false);
    };

    const hideDeleteQuestionDialog = () => {
        setDeleteQuestionDialog(false);
        setEditState(false);
    };

    const hideDeleteQuestionsDialog = () => {
        setDeleteQuestionsDialog(false);
        setEditState(false);
    };

    const hideQuestionGroupDialog = () => {
        setQuestionGroupDialog(false);
        setCustomQuestionGroup("");
    };

    const showQuestionGroupDialog = () => {
        setQuestionGroupDialog(true);
    };

    const onSurveyInputChange = (e) => {
        setCustomSurvey(e.target.value);
    };

    const onQuestionGroupInputChange = (e) => {
        setCustomQuestionGroup(e.target.value);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const header = (
        <div className="d-flex gap-2 justify-content-between align-items-center flex-wrap">
            <h4 className="m-0">Manage Questions</h4>
            <IconField iconPosition="left" className="me-3">
                <InputIcon className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    type="search"
                    onChange={onGlobalFilterChange}
                    placeholder="Search..."
                />
            </IconField>
        </div>
    );

    const confirmDeleteSelected = () => {
        setDeleteQuestionsDialog(true);
        setEditState(false);
    };

    const deleteQuestion = () => {
        let _questions = questions.filter(
            (val) => val.question_id !== question.question_id
        );

        setQuestions(_questions);
        setDeleteQuestionDialog(false);
        setQuestion(initialEmptyQuestion);
        setEditState(false);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Question Deleted",
            life: 2000,
        });
    };

    const editQuestion = async (rowData) => {
        setEditedQuestion({ ...rowData }); // Input current RowData inside Form
        setEditQuestionDialog(true);
        setEditState(true);
    };

    const confirmDeleteQuestion = (question) => {
        setQuestion(question);
        setDeleteQuestionDialog(true);
        setEditState(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="me-2 rounded-pill"
                    outlined
                    onClick={() => {
                        setEditState(true);
                        editQuestion(rowData);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    className="rounded-pill"
                    onClick={() => confirmDeleteQuestion(rowData)}
                />
            </React.Fragment>
        );
    };

    // Footer for: Step 1 (Add Survey Type/Name)
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

    // Footer for: Step 2 (Add Question Grp)
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

    // Footer for: Add Question --> Save Question
    const saveQuestionFooter = (
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
                onClick={saveQuestion}
            />
        </React.Fragment>
    );

    // Footer for: Edit Question --> Save Question
    const editQuestionFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2 rounded"
                outlined
                onClick={hideEditDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="ms-2 rounded"
                iconPos="left"
                onClick={confirmEditQuestion}
            />
        </React.Fragment>
    );

    const deleteQuestionDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2"
                outlined
                onClick={hideDeleteQuestionDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                iconPos="left"
                severity="danger"
                className="ms-2"
                onClick={deleteQuestion}
            />
        </React.Fragment>
    );

    const deleteSelectedQuestions = () => {
        let _questions = questions.filter(
            (val) => !selectedQuestions.includes(val)
        );

        setQuestions(_questions);
        setDeleteQuestionsDialog(false);
        setSelectedQuestions(null);
        setEditState(false);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Questions Deleted",
            life: 2000,
        });
    };

    const deleteQuestionsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                iconPos="left"
                outlined
                onClick={hideDeleteQuestionsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                className="ms-2"
                iconPos="left"
                severity="danger"
                onClick={deleteSelectedQuestions}
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

    const openNew = () => {
        setQuestion({
            ...initialEmptyQuestion,
        });
        setSubmitted(false);
        setQuestionDialog(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="d-flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={openNew}
                    className="rounded"
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    iconPos="left"
                    severity="danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedQuestions || !selectedQuestions.length}
                    className="rounded"
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Export"
                icon="pi pi-upload"
                iconPos="left"
                onClick={exportCSV}
                className="rounded"
            />
        );
    };

    return (
        <>
            <BreadcrumbComponent />
            <Toast ref={toast} />
            <div className="card d-flex justify-content-center">
                <Stepper linear ref={stepperRef} style={{ marginTop: "2rem" }}>
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
                                            <React.Fragment key={index}>
                                                <button
                                                    onClick={() => {
                                                        handleSurveyClick(
                                                            survey
                                                        );
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
                                                        setHoveredSurveyType(
                                                            null
                                                        );
                                                    }}
                                                    className={`btn btn-lg m-2 flex-fill ${
                                                        response.survey_name ===
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
                                                        <h5>
                                                            Question Groups:
                                                        </h5>
                                                        {surveyQuestionGroups
                                                            .filter((group) =>
                                                                group.question_group_name.includes(
                                                                    hoveredSurveyType
                                                                )
                                                            )
                                                            .map(
                                                                (
                                                                    group,
                                                                    index
                                                                ) => {
                                                                    const groupNameAfterDash = group.question_group_name
                                                                        .substring(
                                                                            group.question_group_name.indexOf(
                                                                                "-"
                                                                            ) +
                                                                                1
                                                                        )
                                                                        .trim();
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {
                                                                                groupNameAfterDash
                                                                            }
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
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
                                            </React.Fragment>
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
                                                    response.survey_name
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
                                                    style={{
                                                        marginBottom: "35px",
                                                    }}
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
                                                        onChange={
                                                            onSurveyInputChange
                                                        }
                                                        required
                                                        placeholder="Survey [survey name]"
                                                        className={classNames({
                                                            "p-invalid":
                                                                submitted &&
                                                                !customSurvey,
                                                        })}
                                                    />

                                                    {submitted &&
                                                        !response.survey_name && (
                                                            <>
                                                                <small className="p-error">
                                                                    Survey Type
                                                                    is required
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
                                    disabled={response.survey_name === null}
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
                                style={{ overflow: "auto" }}
                            >
                                <div className="d-flex flex-column">
                                    <h5 className="text-muted">Step 2</h5>
                                    <h1>
                                        Apakah Grup {response.survey_name} Anda?
                                    </h1>
                                    <div
                                        className="d-flex flex-row flex-wrap"
                                        style={{ gap: "25px" }}
                                    >
                                        {/* Button Options  */}
                                        {surveyQuestionGroups
                                            .filter((group) =>
                                                group.question_group_name.includes(
                                                    response.survey_name
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
                                                            response.question_group_name ===
                                                            group.question_group_name
                                                                ? "btn-primary"
                                                                : "btn-outline-primary"
                                                        }`}
                                                        style={{
                                                            height: "100px",
                                                            minWidth: "200px",
                                                            fontSize: "18px",
                                                            borderRadius:
                                                                "30px",
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
                                                            `${response.survey_name} - ${customQuestionGroup}`
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
                                                        `${response.survey_name} - ${customQuestionGroup}`
                                                ) ? (
                                                    <div>
                                                        <i className="pi pi-plus me-2"></i>
                                                        Tambah Question Group
                                                    </div>
                                                ) : (
                                                    response.question_group_name
                                                        .substring(
                                                            response.question_group_name.indexOf(
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
                                                footer={
                                                    questionGroupDialogFooter
                                                }
                                                onHide={hideQuestionGroupDialog}
                                            >
                                                <div
                                                    className="field"
                                                    style={{
                                                        marginBottom: "35px",
                                                    }}
                                                >
                                                    <label
                                                        htmlFor="question_group_name"
                                                        className="font-bold"
                                                    >
                                                        Question Group Name
                                                    </label>
                                                    <InputText
                                                        id="question_group_name"
                                                        value={
                                                            customQuestionGroup
                                                        }
                                                        placeholder={`${response.survey_name} - `}
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
                                                                Question Group
                                                                Name is required
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
                                    disabled={
                                        response.question_group_name === null
                                    }
                                    onClick={() =>
                                        stepperRef.current.nextCallback()
                                    }
                                />
                            </div>
                        </div>
                    </StepperPanel>

                    {/* Step 3 - Add Question */}
                    <StepperPanel header="Add Question">
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        ></Toolbar>
                        <DataTable
                            ref={dt}
                            value={filteredQuestions}
                            selection={selectedQuestions}
                            onSelectionChange={(e) =>
                                setSelectedQuestions(e.value)
                            }
                            paginator
                            rows={5}
                            filters={filters}
                            stripedRows
                            header={header}
                        >
                            <Column
                                selectionMode="multiple"
                                exportable={false}
                            />
                            <Column field="question_id" header="ID" sortable />
                            <Column
                                field="question_name"
                                header="Name"
                                style={{ minWidth: "18rem" }}
                                sortable
                            />
                            <Column
                                field="question_key"
                                header="Key"
                                sortable
                            />
                            <Column
                                field="question_type"
                                header="Type"
                                sortable
                            />
                            <Column
                                field="question_group_id"
                                header="Question Group ID"
                                sortable
                            />
                            <Column
                                field="sequence"
                                header="Sequence"
                                sortable
                            />
                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "12rem" }}
                                frozen
                                alignFrozen="right"
                            ></Column>
                        </DataTable>

                        {/* Add Question Dialog */}
                        <Dialog
                            visible={questionDialog}
                            style={{ width: "32rem", maxHeight: "90vh" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Question Details"
                            modal
                            className="p-fluid"
                            footer={saveQuestionFooter}
                            onHide={hideDialog}
                        >
                            <div
                                className="field"
                                style={{
                                    marginBottom: "35px",
                                    marginTop: "20px",
                                }}
                            >
                                <span className="p-float-label">
                                    <InputText
                                        id="question_name"
                                        value={response.question_name}
                                        onChange={(e) =>
                                            onInputChange(e, "question_name")
                                        }
                                        required
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                submitted &&
                                                !response.question_name,
                                        })}
                                    />
                                    <label
                                        htmlFor="question_name"
                                        className="font-bold"
                                    >
                                        Question Name
                                    </label>
                                </span>
                                {submitted && !response.question_name && (
                                    <small className="p-error">
                                        Question Name is required.
                                    </small>
                                )}
                            </div>

                            <div
                                className="field"
                                style={{ marginBottom: "35px" }}
                            >
                                <span className="p-float-label">
                                    <InputText
                                        id="question_key"
                                        value={response.question_key}
                                        onChange={(e) =>
                                            onInputChange(e, "question_key")
                                        }
                                        required
                                        className={classNames({
                                            "p-invalid":
                                                submitted &&
                                                !response.question_key,
                                        })}
                                    />
                                    <label
                                        htmlFor="question_key"
                                        className="font-bold"
                                    >
                                        Question Key
                                    </label>
                                </span>
                                {submitted && !response.question_key && (
                                    <small className="p-error">
                                        Question Key is required.
                                    </small>
                                )}
                            </div>
                            <div
                                className="field mb-3 mt-3"
                                style={{ marginBottom: "35px" }}
                            >
                                <FloatLabel
                                    className={classNames("w-full md:w-14rem", {
                                        "p-invalid":
                                            isSubmitted &&
                                            !response.question_type,
                                    })}
                                >
                                    <Dropdown
                                        inputId="question_type"
                                        value={response.question_type}
                                        options={questionTypes}
                                        onChange={(e) =>
                                            onInputChange(e, "question_type")
                                        }
                                        optionLabel="label"
                                        required
                                        className={classNames({
                                            "p-invalid":
                                                isSubmitted &&
                                                !response.question_type,
                                        })}
                                    />
                                    <label
                                        htmlFor="question_type"
                                        className="font-bold"
                                    >
                                        Question Type
                                    </label>
                                </FloatLabel>
                                {isSubmitted && !response.question_type && (
                                    <small className="p-error">
                                        Question type is required.
                                    </small>
                                )}
                            </div>

                            <div
                                className="formgrid grid"
                                style={{ marginTop: "35px" }}
                            >
                                <div className="field col">
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="sequence"
                                            name="sequence"
                                            value={response.sequence}
                                            required
                                            className={classNames({
                                                "p-invalid":
                                                    submitted &&
                                                    !response.sequence,
                                            })}
                                            onValueChange={(e) =>
                                                onInputNumberChange(
                                                    e,
                                                    "sequence"
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="sequence"
                                            className="font-bold"
                                        >
                                            Sequence
                                        </label>
                                    </span>
                                    {submitted && !response.sequence && (
                                        <small className="p-error">
                                            Sequence is required.
                                        </small>
                                    )}
                                </div>
                                <div
                                    className="field col"
                                    style={{
                                        marginTop: "35px",
                                        marginBottom: "35px",
                                    }}
                                >
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="data_status"
                                            value={response.data_status}
                                            required
                                            className={classNames({
                                                "p-invalid":
                                                    submitted &&
                                                    !response.data_status,
                                            })}
                                            onValueChange={(e) =>
                                                onInputNumberChange(
                                                    e,
                                                    "data_status"
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="data_status"
                                            className="font-bold"
                                        >
                                            Status
                                        </label>
                                    </span>
                                    {submitted && !response.data_status && (
                                        <small className="p-error">
                                            Status is required.
                                        </small>
                                    )}
                                </div>
                                <div
                                    className="field"
                                    style={{
                                        marginBottom: "35px",
                                        minWidth: "12rem",
                                        marginTop: "40px",
                                    }}
                                >
                                    <span className="p-float-label">
                                        <InputText
                                            id="survey_name"
                                            style={{
                                                minWidth: "20rem",
                                            }}
                                            value={response.survey_name}
                                            readOnly={true}
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
                                            style={{ minWidth: "20rem" }}
                                            value={response.question_group_name}
                                            readOnly={true}
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
                                    }}
                                >
                                    <span className="p-float-label">
                                        <InputText
                                            id="question_group_id"
                                            value={response.question_group_id}
                                            readOnly={true}
                                            className={classNames({
                                                "p-invalid":
                                                    submitted &&
                                                    !response.question_group_id,
                                            })}
                                        />
                                        <label
                                            htmlFor="question_group_id"
                                            className="font-bold"
                                        >
                                            Question Group ID
                                        </label>
                                    </span>
                                    {submitted &&
                                        !response.question_group_id && (
                                            <small className="p-error">
                                                Question Group ID is required.
                                            </small>
                                        )}
                                </div>
                            </div>
                        </Dialog>

                        {/* Edit Question Dialog */}
                        <Dialog
                            visible={editQuestionDialog}
                            style={{ width: "32rem", maxHeight: "90vh" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Question Details"
                            modal
                            className="p-fluid"
                            footer={editQuestionFooter}
                            onHide={hideEditDialog}
                        >
                            <div
                                className="field"
                                style={{
                                    marginBottom: "35px",
                                    marginTop: "20px",
                                }}
                            >
                                <span className="p-float-label">
                                    <InputText
                                        id="question_name"
                                        value={editedQuestion.question_name}
                                        onChange={(e) =>
                                            onInputChange(e, "question_name")
                                        }
                                        required
                                        autoFocus
                                        className={classNames({
                                            "p-invalid":
                                                submitted &&
                                                !editedQuestion.question_name,
                                        })}
                                    />
                                    <label
                                        htmlFor="question_name"
                                        className="font-bold"
                                    >
                                        Question Name
                                    </label>
                                </span>
                                {submitted && !editedQuestion.question_name && (
                                    <small className="p-error">
                                        Question Name is required.
                                    </small>
                                )}
                            </div>

                            <div
                                className="field"
                                style={{ marginBottom: "35px" }}
                            >
                                <span className="p-float-label">
                                    <InputText
                                        id="question_key"
                                        value={editedQuestion.question_key}
                                        onChange={(e) =>
                                            onInputChange(e, "question_key")
                                        }
                                        required
                                        className={classNames({
                                            "p-invalid":
                                                submitted &&
                                                !editedQuestion.question_key,
                                        })}
                                    />
                                    <label
                                        htmlFor="question_key"
                                        className="font-bold"
                                    >
                                        Question Key
                                    </label>
                                </span>
                                {submitted && !editedQuestion.question_key && (
                                    <small className="p-error">
                                        Question Key is required.
                                    </small>
                                )}
                            </div>
                            <div
                                className="field mb-3 mt-3"
                                style={{ marginBottom: "35px" }}
                            >
                                <FloatLabel
                                    className={classNames("w-full md:w-14rem", {
                                        "p-invalid":
                                            isSubmitted &&
                                            !editedQuestion.question_type,
                                    })}
                                >
                                    <Dropdown
                                        inputId="question_type"
                                        value={editedQuestion.question_type}
                                        options={questionTypes}
                                        onChange={(e) =>
                                            onInputChange(e, "question_type")
                                        }
                                        optionLabel="label"
                                        required
                                        className={classNames({
                                            "p-invalid":
                                                isSubmitted &&
                                                !editedQuestion.question_type,
                                        })}
                                    />
                                    <label
                                        htmlFor="question_type"
                                        className="font-bold"
                                    >
                                        Question Type
                                    </label>
                                </FloatLabel>
                                {isSubmitted &&
                                    !editedQuestion.question_type && (
                                        <small className="p-error">
                                            Question type is required.
                                        </small>
                                    )}
                            </div>

                            <div
                                className="formgrid grid"
                                style={{ marginTop: "35px" }}
                            >
                                <div className="field col">
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="sequence"
                                            name="sequence"
                                            value={editedQuestion.sequence}
                                            required
                                            className={classNames({
                                                "p-invalid":
                                                    submitted &&
                                                    !editedQuestion.sequence,
                                            })}
                                            onValueChange={(e) =>
                                                onInputNumberChange(
                                                    e,
                                                    "sequence"
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="sequence"
                                            className="font-bold"
                                        >
                                            Sequence
                                        </label>
                                    </span>
                                    {submitted && !editedQuestion.sequence && (
                                        <small className="p-error">
                                            Sequence is required.
                                        </small>
                                    )}
                                </div>
                                <div
                                    className="field col"
                                    style={{
                                        marginTop: "35px",
                                        marginBottom: "35px",
                                    }}
                                >
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="data_status"
                                            value={editedQuestion.data_status}
                                            required
                                            className={classNames({
                                                "p-invalid":
                                                    submitted &&
                                                    !editedQuestion.data_status,
                                            })}
                                            onValueChange={(e) =>
                                                onInputNumberChange(
                                                    e,
                                                    "data_status"
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="data_status"
                                            className="font-bold"
                                        >
                                            Status
                                        </label>
                                    </span>
                                    {submitted &&
                                        !editedQuestion.data_status && (
                                            <small className="p-error">
                                                Status is required.
                                            </small>
                                        )}
                                </div>
                                <div
                                    className="field"
                                    style={{
                                        marginBottom: "35px",
                                        minWidth: "12rem",
                                        marginTop: "40px",
                                    }}
                                >
                                    <span className="p-float-label">
                                        <InputText
                                            id="survey_name"
                                            style={{
                                                minWidth: "20rem",
                                            }}
                                            value={editedQuestion.survey_name}
                                            readOnly={true}
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
                                            style={{ minWidth: "20rem" }}
                                            value={
                                                editedQuestion.question_group_name
                                            }
                                            readOnly={true}
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
                                    }}
                                >
                                    <span className="p-float-label">
                                        <InputText
                                            id="question_group_id"
                                            value={
                                                editedQuestion.question_group_id
                                            }
                                            readOnly={true}
                                            className={classNames({
                                                "p-invalid":
                                                    submitted &&
                                                    !editedQuestion.question_group_id,
                                            })}
                                        />
                                        <label
                                            htmlFor="question_group_id"
                                            className="font-bold"
                                        >
                                            Question Group ID
                                        </label>
                                    </span>
                                    {submitted &&
                                        !editedQuestion.question_group_id && (
                                            <small className="p-error">
                                                Question Group ID is required.
                                            </small>
                                        )}
                                </div>
                            </div>
                        </Dialog>

                        {/* Delete Question Dialog */}
                        <Dialog
                            visible={deleteQuestionDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteQuestionDialogFooter}
                            onHide={hideDeleteQuestionDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle me-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {question && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{question.question_name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>

                        {/* Delete Questions Dialog */}
                        <Dialog
                            visible={deleteQuestionsDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteQuestionsDialogFooter}
                            onHide={hideDeleteQuestionsDialog}
                        >
                            <div className="d-flex align-middle">
                                <div className="confirmation-content">
                                    <i
                                        className="pi pi-exclamation-triangle me-3"
                                        style={{ fontSize: "2rem" }}
                                    />
                                    {question && (
                                        <span className="">
                                            Are you sure you want to delete the
                                            selected questions?
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Dialog>

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
                                label="Done"
                                className="rounded"
                                icon="pi pi-check"
                                iconPos="right"
                                onClick={() =>
                                    stepperRef.current.nextCallback()
                                }
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </>
    );
}
