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
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import axios from "axios";
import "../../css/app.css";
import "../../css/NewQuestion.css";
import BreadcrumbComponent from "../components/BreadcrumbComponent";
import LeftToolbar from "../components/LeftToolbar";
import RightToolbar from "../components/RightToolbar";
import AddEditQuestionDialog from "./AddEditQuestionDialog";
import OptionsDialog from "../components/OptionsDialog";

export default function NewQuestion() {
    const op = useRef(null);
    const stepperRef = useRef(null);
    const dt = useRef(null);
    const toast = useRef(null);

    // Questions
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [questionDialog, setQuestionDialog] = useState(false);
    const [questionGroupDialog, setQuestionGroupDialog] = useState(false);
    const [customQuestionGroup, setCustomQuestionGroup] = useState("");

    // Surveys
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [customSurvey, setCustomSurvey] = useState("");
    const [hoveredSurveyType, setHoveredSurveyType] = useState(null);

    const [loading, setLoading] = useState(true);

    // Submitted
    const [submitted, setSubmitted] = useState(false);
    const [submittedQuestion, setSubmittedQuestion] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [editState, setEditState] = useState(false);

    // Delete Question
    const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);
    const [deleteQuestionsDialog, setDeleteQuestionsDialog] = useState(false);

    // Options
    const [optionDialogVisible, setOptionDialogVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState({}); // Current Question (Row) to get Options Data

    // Mapping between question and question group id
    const [mapGrpId, setMapGrpId] = useState(null);
    const [response, setResponse] = useState({
        question_id: null,
        survey_name: null,
        question_group_name: "",
        question_group_id: mapGrpId,
        question_key: "",
        question_type: "",
        question_name: "",
        sequence: null,
        data_status: null,
        is_parent: 0,
        is_mandatory: 0,
        option_1: null,
        option_1_flow: null,
        option_2: null,
        option_2_flow: null,
        option_3: null,
        option_3_flow: null,
        option_4: null,
        option_4_flow: null,
        option_5: null,
        option_5_flow: null,
        option_6: null,
        option_6_flow: null,
        option_7: null,
        option_7_flow: null,
        option_8: null,
        option_8_flow: null,
        option_9: null,
        option_9_flow: null,
    });

    // Filters
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        question_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

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

    const onCheckboxChange = (e, name) => {
        const val = e.checked ? 1 : 0;
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
        sequence: null,
        question_name: "",
        question_type: "",
        data_status: null,
        is_parent: 0,
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

    // Mapping between question_id and question_group_name
    useEffect(() => {
        if (response.question_group_name) {
            getQuestionIDMap(response.question_group_name);
        }
    }, [response.question_group_name]);

    useEffect(() => {
        getQuestions();
        getSurveys();
        getSurveyQuestionGroups();
    }, response); // might need to change

    const filterQuestionsByGroupName = async () => {
        await getQuestions();

        const filteredQuestions = questions.filter((question) => {
            return (
                question.question_group_name &&
                question.question_group_name.includes(
                    response.question_group_name
                )
            );
        });

        setFilteredQuestions(filteredQuestions);
    };

    useEffect(() => {
        filterQuestionsByGroupName();
    }, [response]);

    // Page 1
    const handleSurveyClick = (survey) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            survey_name: survey.survey_name,
        }));
    };

    // Page 2
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

    /**
     * Function to check if question_id exists.
     * Returns the index of the found question_id if found, -1 otherwise.
     * @param {*} question_id Question ID we want to check
     * @returns The index of the found Question ID, -1 if not found
     */
    const findIndexByID = (question_id) => {
        let index = -1;

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].question_id === question_id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const saveQuestion = async () => {
        setSubmitted(true);

        if (
            response.question_name.trim() &&
            response.question_type.trim() &&
            response.sequence &&
            response.data_status &&
            response.question_group_id
        ) {
            let _questions = [...questions];
            let _response = { ...response };
            // let result = null;

            var formData = new FormData();
            formData.append("question_group_id", _response.question_group_id);
            formData.append("question_name", _response.question_name);
            formData.append("question_key", _response.question_key);
            formData.append("question_type", _response.question_type);
            formData.append("sequence", _response.sequence);
            formData.append("data_status", _response.data_status);
            formData.append("is_parent", _response.is_parent);
            formData.append("is_mandatory", _response.is_mandatory);

            const index = findIndexByID(_response.question_id);

            try {
                let result;
                if (index >= 0 && editState) {
                    // Update existing question
                    result = await axios.post(
                        `/editQuestion/${_response.question_id}`,
                        formData
                    );

                    if (result.status === 200) {
                        _questions[index] = _response;
                        toast.current.show({
                            severity: "success",
                            summary: "Successful",
                            detail: `Question ${_response.sequence} Updated`,
                            life: 2000,
                        });
                        setResponse((prevResponse) => ({
                            ...prevResponse,
                            // question_id: result.data.data.question_id,
                            // question_key: result.data.data.question_key,
                            question_type: "",
                            question_name: "",
                            sequence: null,
                            data_status: null,
                            is_parent: 0,
                        }));
                    }
                } else {
                    // New Question
                    result = await axios.post("/addQuestion", formData);
                    //TODO (minor BUG): Fix seqence when add first time
                    if (result.status === 200) {
                        const newQuestion = result.data.data || result.data;
                        _questions.push(_response);
                        toast.current.show({
                            severity: "success",
                            summary: "Successful",
                            detail: `Question ${newQuestion.sequence} Created`,
                            life: 2000,
                        });

                        setResponse((prevResponse) => ({
                            ...prevResponse,
                            // question_id: result.data.data.question_id,
                            // question_key: result.data.data.question_key,
                            question_type: "",
                            question_name: "",
                            sequence: null,
                            data_status: null,
                            is_parent: 0,
                        }));
                    }
                }
            } catch (error) {
                console.error("There was an error saving the question!", error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: `Failed Saving Question ${_response.sequence}`,
                    life: 2000,
                });
            }
            setQuestions(_questions);
            setQuestionDialog(false);
            setEditState(false);
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
        setSubmitted(false);
        setQuestionDialog(false);
        setEditState(false);
        filterQuestionsByGroupName();
    };

    const hideDeleteQuestionDialog = () => {
        setDeleteQuestionDialog(false);
        setEditState(false);
        filterQuestionsByGroupName();
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

    const deleteQuestion = async () => {
        let _questions = [...questions];
        let _response = { ...response };
        const url = `/deleteQuestion/${_response.question_id}`;

        try {
            const result = await axios.delete(url);
            if (result.status === 200) {
                // Update the UI after successful deletion
                _questions = _questions.filter(
                    (val) => val.question_id !== _response.question_id
                );
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: `Question ${_response.sequence} Deleted`,
                    life: 2000,
                });
            }
            setQuestions(_questions);
            setResponse((prevResponse) => ({
                ...prevResponse,
                question_key: "",
                question_type: "",
                question_name: "",
                sequence: null,
                data_status: null,
            }));
            filterQuestionsByGroupName();
        } catch (error) {
            console.error("Error deleting question", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed Deleting Question ${_response.sequence}`,
                life: 2000,
            });
            setQuestions(_questions);
        } finally {
            setDeleteQuestionDialog(false);
            setQuestion(initialEmptyQuestion);
            setEditState(false);
            getQuestions();
            filterQuestionsByGroupName();
        }
    };

    const deleteQuestionDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                iconPos="left"
                className="ms-2 rounded"
                outlined
                onClick={hideDeleteQuestionDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                rounded
                iconPos="left"
                severity="danger"
                className="ms-2 rounded"
                onClick={deleteQuestion}
            />
        </React.Fragment>
    );

    const deleteSelectedQuestions = async () => {
        var selectedQuestionsID = [];
        let _questions = [...questions];
        if (selectedQuestions) {
            for (let i = 0; i < selectedQuestions.length; i++) {
                selectedQuestionsID.push(selectedQuestions[i].question_id);
            }
        }

        try {
            for (let i = 0; i < selectedQuestionsID.length; i++) {
                const question_id = selectedQuestionsID[i];
                const url = `/deleteQuestion/${question_id}`;
                const result = await axios.delete(url);

                if (result.status === 200) {
                    _questions = questions.filter(
                        (val) => !selectedQuestionsID.includes(val.question_id)
                    );
                }
                setQuestions(_questions);
                setResponse((prevResponse) => ({
                    ...prevResponse,
                    question_key: "",
                    question_type: "",
                    question_name: "",
                    sequence: null,
                    data_status: null,
                }));
                filterQuestionsByGroupName();
            }
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Selected Questions Deleted",
                life: 2000,
            });
        } catch (error) {
            console.error("Error deleting questions", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: `Failed Deleting Selected Questions`,
                life: 2000,
            });
            setQuestions(_questions);
        } finally {
            setQuestions(_questions);
            setDeleteQuestionsDialog(false);
            setSelectedQuestions(null);
            setEditState(false);
            getQuestions();
            filterQuestionsByGroupName();
        }
    };

    const deleteQuestionsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                rounded
                className="ms-2 rounded"
                iconPos="left"
                outlined
                onClick={hideDeleteQuestionsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                rounded
                className="ms-2 rounded"
                iconPos="left"
                severity="danger"
                onClick={deleteSelectedQuestions}
            />
        </React.Fragment>
    );

    const editQuestion = (question) => {
        setResponse({ ...question });
        setQuestionDialog(true);
        setEditState(true);
    };

    // Do Delete A Question
    const confirmDeleteQuestion = (question) => {
        setResponse({ ...question });
        setDeleteQuestionDialog(true);
        filterQuestionsByGroupName();
    };

    // Do Delete Questions
    const confirmDeleteSelected = () => {
        setDeleteQuestionsDialog(true);
        filterQuestionsByGroupName();
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

    const optionsBodyTemplate = (rowData) => {
        return (
            <Button
                className="rounded-circle"
                icon="pi pi-external-link"
                rounded
                text
                onClick={() => {
                    setSelectedRow(rowData);
                    setOptionDialogVisible(true);
                }}
            />
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

    const saveQuestionFooter = (
        <React.Fragment>
            <div className="mt-2">
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
            </div>
        </React.Fragment>
    );

    const openNew = () => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            ...initialEmptyQuestion,
        }));
        setSubmitted(false);
        setQuestionDialog(true);
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const paginatorLeft = (
        <Button
            type="button"
            icon="pi pi-refresh"
            text
            onClick={filterQuestionsByGroupName}
        />
    );

    const paginatorRight = (
        <Button type="button" icon="pi pi-download" text onClick={exportCSV} />
    );

    const leftToolbarTemplate = () => {
        return (
            <LeftToolbar
                openNew={openNew}
                confirmDeleteSelected={confirmDeleteSelected}
                selectedQuestions={selectedQuestions}
            />
        );
    };

    const rightToolbarTemplate = () => {
        return <RightToolbar exportCSV={exportCSV} />;
    };

    const isParentBodyTemplate = (rowData) => {
        const isParent = rowData.is_parent === 1 ? 1 : 0;
        const iconClassName = classNames(
            "pi", // PrimeIcons base class
            {
                "pi-check text-success": isParent,
                "pi-minus text-danger": !isParent,
            }
        );

        return (
            <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{ width: "2rem", height: "2rem" }}
            >
                <i className={iconClassName} style={{ fontSize: "20px" }}></i>
            </div>
        );
    };

    const isMandatoryBodyTemplate = (rowData) => {
        const isMandatory = rowData.is_mandatory === 1 ? 1 : 0;
        const iconClassName = classNames(
            "pi", // PrimeIcons base class
            {
                "pi-check text-success": isMandatory, // Green check icon for mandatory
                "pi-minus text-danger": !isMandatory, // Red minus icon for non-mandatory
            }
        );

        return (
            <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{ width: "2rem", height: "2rem" }}
            >
                <i className={iconClassName} style={{ fontSize: "20px" }}></i>
            </div>
        );
    };

    const updateResponseOptions = async (updatedOptions) => {
        let _questions = [...questions];
        const index = findIndexByID(updatedOptions.question_id);

        try {
            const result = await axios.post(
                `/editQuestion/${updatedOptions.question_id}`,
                updatedOptions
            );

            if (result.status === 200) {
                _questions[index] = {
                    ..._questions[index],
                    ...updatedOptions, // Merge the updated options into the existing question
                };

                setQuestions(_questions); // Update the local state with the modified questions

                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: `Options for Question ${updatedOptions.sequence} Updated`,
                    life: 2000,
                });

                // Optionally reset the response state to its initial values
                setResponse((prevResponse) => ({
                    ...prevResponse,
                    question_type: "",
                    question_name: "",
                    sequence: null,
                    data_status: null,
                    is_parent: 0,
                    is_mandatory: 0,
                    option_1: null,
                    option_1_flow: null,
                    option_2: null,
                    option_2_flow: null,
                    option_3: null,
                    option_3_flow: null,
                    option_4: null,
                    option_4_flow: null,
                    option_5: null,
                    option_5_flow: null,
                    option_6: null,
                    option_6_flow: null,
                    option_7: null,
                    option_7_flow: null,
                    option_8: null,
                    option_8_flow: null,
                    option_9: null,
                    option_9_flow: null,
                }));
            }
        } catch (error) {
            console.error("Error updating options:", error);

            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update options",
                life: 3000,
            });
        } finally {
            // Ensure that the response is reset regardless of success or failure
            setResponse((prevResponse) => ({
                ...prevResponse,
                question_type: "",
                question_name: "",
                sequence: null,
                data_status: null,
                is_parent: 0,
                is_mandatory: 0,
                option_1: null,
                option_1_flow: null,
                option_2: null,
                option_2_flow: null,
                option_3: null,
                option_3_flow: null,
                option_4: null,
                option_4_flow: null,
                option_5: null,
                option_5_flow: null,
                option_6: null,
                option_6_flow: null,
                option_7: null,
                option_7_flow: null,
                option_8: null,
                option_8_flow: null,
                option_9: null,
                option_9_flow: null,
            }));
        }
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
                            paginatorLeft={paginatorLeft}
                            paginatorRight={paginatorRight}
                            rows={5}
                            sortField="sequence"
                            sortOrder={1}
                            filters={filters}
                            stripedRows
                            header={header}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="{first} to {last} of {totalRecords} questions"
                        >
                            <Column
                                selectionMode="multiple"
                                exportable={false}
                                style={{ width: "4rem" }}
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                field="sequence"
                                header="Sequence"
                                style={{ width: "2rem" }}
                                sortable
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                field="question_name"
                                header="Name"
                                style={{ width: "20rem" }}
                                sortable
                            />
                            <Column
                                field="question_type"
                                header="Type"
                                style={{ width: "4rem" }}
                                sortable
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                field="is_parent"
                                header="Parent?"
                                sortable
                                style={{ width: "4rem" }}
                                body={isParentBodyTemplate}
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                field="is_mandatory"
                                header="Mandatory?"
                                sortable
                                style={{ width: "4rem" }}
                                body={isMandatoryBodyTemplate}
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                body={optionsBodyTemplate}
                                header="Options"
                                exportable={false}
                                style={{ width: "4rem" }}
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "12rem" }}
                                bodyStyle={{ textAlign: "center" }}
                            />
                        </DataTable>

                        {/* Add and Edit Questions Dialog */}
                        <AddEditQuestionDialog
                            visible={questionDialog}
                            response={response}
                            onInputChange={onInputChange}
                            onInputNumberChange={onInputNumberChange}
                            questionTypes={questionTypes}
                            saveQuestionFooter={saveQuestionFooter}
                            hideDialog={hideDialog}
                            submitted={submitted}
                            isSubmitted={isSubmitted}
                            onCheckboxChange={onCheckboxChange}
                        />
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

                        {/* View Options Dialog */}
                        <OptionsDialog
                            visible={optionDialogVisible}
                            onHide={() => {
                                setOptionDialogVisible(false);
                            }}
                            selectedRow={selectedRow}
                            updateResponse={updateResponseOptions} // already contains updated response
                        />

                        {/* Page Control Buttons */}
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
