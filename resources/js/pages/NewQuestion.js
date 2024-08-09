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

export default function NewQuestion() {
    const op = useRef(null);
    const stepperRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState([]);
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
    const [questionGroupDialog, setQuestionGroupDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [editState, setEditState] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dt = useRef(null);
    const [response, setResponse] = useState({
        survey_name: null,
        question_group_name: null,
        question_group_id: null,
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

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _question = { ...question };
        _question[`${name}`] = val;
        setQuestion(_question);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _question = { ...question };
        _question[`${name}`] = val;
        setQuestion(_question);
    };

    const handleTypeChange = (e) => {
        setResponse((prev) => ({ ...prev, question_type: e.value }));
    };

    const questionTypes = ["Text", "Choice", "Checkboxes", "Dropdown"];

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

    const saveQuestion = async () => {
        setSubmitted(true);

        if (question.question_name.trim()) {
            let _questions = [...questions];
            let _question = { ...question };

            if (_question.question_id) {
                const index = findIndexById(_question.question_id);
                if (index >= 0) {
                    _questions[index] = _question;
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Question Updated",
                        life: 2000,
                    });
                } else {
                    _questions.push(_question);
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Question Created",
                        life: 2000,
                    });
                }
            }

            var formData = new FormData();
            formData.append("question_group_id", _question.question_group_id);
            formData.append("question_name", _question.question_name);
            formData.append("question_key", _question.question_key);
            formData.append("question_type", _question.question_type);
            formData.append("sequence", _question.sequence);
            formData.append("status", _question.status);
            formData.append("data_status", _question.data_status);
            var url = "/addQuestion";
            var hasil = await axios({
                method: "post",
                url: url,
                data: formData,
            }).then(function (response) {
                return response;
            });
            setQuestions(_questions);
            setQuestionDialog(false);
            setQuestion(initialEmptyQuestion);
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
    };

    const showQuestionGroupDialog = () => {
        setQuestionGroupDialog(true);
    };

    const hideQuestionGroupDialog = () => {
        setQuestionGroupDialog(false);
        setCustomQuestionGroup("");
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
            <h4 className="m-0">{response.question_group_name}</h4>
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

    const confirmDeleteQuestion = (question) => {
        setQuestion(question);
        setDeleteQuestionDialog(true);
        setEditState(false);
    };

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

    const editQuestion = (question) => {
        setQuestion({ ...question });
        setQuestionDialog(true);
        setEditState(true);
    };

    // Step 1
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

    // Step 2
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

    const step3Footer = (
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
                onClick={saveQuestion}
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
        <div className="card d-flex justify-content-center">
            <Stepper linear ref={stepperRef} style={{ flexBasis: "60rem" }}>
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
                            style={{ height: "50vh", overflow: "auto" }}
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
                                            footer={questionGroupDialogFooter}
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
                                                    value={customQuestionGroup}
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
                                disabled={response.question_group_name === null}
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
                        onSelectionChange={(e) => setSelectedQuestions(e.value)}
                        paginator
                        rows={5}
                        filters={filters}
                        stripedRows
                        header={header}
                    >
                        <Column selectionMode="multiple" exportable={false} />
                        <Column field="question_id" header="ID" sortable />
                        <Column field="question_name" header="Name" sortable />
                        <Column field="question_key" header="Key" sortable />
                        <Column field="question_type" header="Type" sortable />
                        <Column
                            field="question_group_id"
                            header="Question Group ID"
                            sortable
                        />
                        <Column field="sequence" header="Sequence" sortable />
                        <Column
                            body={actionBodyTemplate}
                            field="Edit"
                            exportable={false}
                            style={{ minWidth: "12rem" }}
                            frozen
                            alignFrozen="right"
                        ></Column>
                    </DataTable>
                    <Dialog
                        visible={questionDialog}
                        style={{ width: "32rem", maxHeight: "90vh" }}
                        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                        header={`Tambah Pertanyaan ${response.question_group_name}`}
                        modal
                        className="p-fluid"
                        footer={step3Footer}
                        onHide={hideDialog}
                    >
                        <div
                            className="field"
                            style={{
                                marginBottom: "35px",
                                marginTop: "20px",
                                minWidth: "12rem",
                            }}
                        >
                            <span className="p-float-label">
                                <InputText
                                    id="survey_name"
                                    required
                                    style={{ minWidth: "20rem" }}
                                    value={response.survey_name}
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
                                    value={response.question_group_name}
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
                            style={{ marginBottom: "35px", marginTop: "20px" }}
                        >
                            <span className="p-float-label">
                                <InputText
                                    id="question_group_id"
                                    value={question.question_group_id}
                                    onChange={(e) =>
                                        onInputChange(e, "question_group_id")
                                    }
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid":
                                            submitted &&
                                            !question.question_group_id,
                                    })}
                                />
                                <label
                                    htmlFor="question_group_id"
                                    className="font-bold"
                                >
                                    Question Group ID
                                </label>
                            </span>
                            {submitted && !question.question_group_id && (
                                <small className="p-error">
                                    Question Group ID is required.
                                </small>
                            )}
                        </div>

                        <div className="field" style={{ marginBottom: "35px" }}>
                            <span className="p-float-label">
                                <InputText
                                    id="question_name"
                                    value={question.question_name}
                                    onChange={(e) =>
                                        onInputChange(e, "question_name")
                                    }
                                    required
                                    className={classNames({
                                        "p-invalid":
                                            submitted &&
                                            !question.question_name,
                                    })}
                                />
                                <label
                                    htmlFor="question_name"
                                    className="font-bold"
                                >
                                    Question Name
                                </label>
                            </span>
                            {submitted && !question.question_name && (
                                <small className="p-error">
                                    Question Name is required.
                                </small>
                            )}
                        </div>

                        <div className="field" style={{ marginBottom: "35px" }}>
                            <span className="p-float-label">
                                <InputText
                                    id="question_key"
                                    value={question.question_key}
                                    onChange={(e) =>
                                        onInputChange(e, "question_key")
                                    }
                                    required
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !question.question_key,
                                    })}
                                />
                                <label
                                    htmlFor="question_key"
                                    className="font-bold"
                                >
                                    Question Key
                                </label>
                            </span>
                            {submitted && !question.question_key && (
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
                                        isSubmitted && !question.question_type,
                                })}
                            >
                                <Dropdown
                                    inputId="question_type"
                                    value={question.question_type}
                                    options={questionTypes}
                                    // onChange={handleTypeChange}
                                    onChange={(e) =>
                                        onInputChange(e, "question_type")
                                    }
                                    optionLabel="label"
                                    required
                                    className={classNames({
                                        "p-invalid":
                                            isSubmitted &&
                                            !question.question_type,
                                    })}
                                />
                                <label
                                    htmlFor="question_type"
                                    className="font-bold"
                                >
                                    Question Type
                                </label>
                            </FloatLabel>
                            {isSubmitted && !question.question_type && (
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
                                        value={question.sequence}
                                        required
                                        className={classNames({
                                            "p-invalid":
                                                submitted && !question.sequence,
                                        })}
                                        onValueChange={(e) =>
                                            onInputNumberChange(e, "sequence")
                                        }
                                    />
                                    <label
                                        htmlFor="sequence"
                                        className="font-bold"
                                    >
                                        Sequence
                                    </label>
                                </span>
                                {submitted && !question.sequence && (
                                    <small className="p-error">
                                        Sequence is required.
                                    </small>
                                )}
                            </div>
                            <div
                                className="field col"
                                style={{ marginTop: "35px" }}
                            >
                                <span className="p-float-label">
                                    <InputNumber
                                        id="data_status"
                                        value={question.data_status}
                                        required
                                        className={classNames({
                                            "p-invalid":
                                                submitted &&
                                                !question.data_status,
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
                                {submitted && !question.data_status && (
                                    <small className="p-error">
                                        Status is required.
                                    </small>
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
                            onClick={() => stepperRef.current.prevCallback()}
                        />
                        <Button
                            label="Submit"
                            className="rounded"
                            icon="pi pi-check"
                            iconPos="right"
                            // disabled={response.question_group_name === null}
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>
    );
}
