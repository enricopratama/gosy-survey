import React, { useEffect, useRef, useState } from "react";
import { Stepper } from "primereact/stepper";
import { ProgressSpinner } from "primereact/progressspinner";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Toolbar } from "primereact/toolbar";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { InputSwitch } from "primereact/inputswitch";
import { PageControlButtons } from "../components/PageControls";
import axios from "axios";
import "../../css/app.css";
import "../../css/NewQuestion.css";
import "../../css/DataTable.css";
import BreadcrumbComponent from "../components/BreadcrumbComponent";
import LeftToolbar from "../components/LeftToolbar";
import RightToolbar from "../components/RightToolbar";
import AddEditQuestionDialog from "./AddEditQuestionDialog";
import OptionsDialog from "../components/OptionsDialog";
import SurveyDialog from "../components/SurveyDialog";
import QuestionGroupDialog from "../components/QuestionGroupDialog";
import Step3Header from "../handlers/Step3Header";
import DSOSelection from "../components/DSOSelection";

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
    const questionTypes = ["Text", "Choice", "Checkboxes", "Dropdown"];
    const initialEmptyQuestion = {
        question_key: "",
        sequence: null,
        question_name: "",
        question_type: "",
        data_status: 1,
        is_parent: 0,
        is_mandatory: 1,
    };

    const [isReordering, setIsReordering] = useState(false);

    // Data Table Size
    const [size, setSize] = useState("small"); // Default size

    // Update UI toggle (call after CRUD)
    const [updateUI, setUpdateUI] = useState(false);

    // Question Groups
    const [questionGroupDialog, setQuestionGroupDialog] = useState(false);
    const [customQuestionGroup, setCustomQuestionGroup] = useState("");
    const [customQuestionGroupStatus, setCustomQuestionGroupStatus] = useState(
        1
    );
    const [maxSequence, setMaxSequence] = useState(1);

    // Surveys
    const [surveys, setSurveys] = useState([]);
    const [surveyQuestionGroups, setSurveyQuestionGroups] = useState([]);
    const [customSurvey, setCustomSurvey] = useState("");
    const [hoveredSurveyType, setHoveredSurveyType] = useState(null);
    const [customSurveyStatus, setCustomSurveyStatus] = useState(1);

    // Loading
    const [loading, setLoading] = useState(true);

    // Submitted
    const [submitted, setSubmitted] = useState(false);
    const [submittedQuestion, setSubmittedQuestion] = useState(false);

    const [editState, setEditState] = useState(false);

    // Delete Question
    const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);
    const [deleteQuestionsDialog, setDeleteQuestionsDialog] = useState(false);

    // Options
    const [optionDialogVisible, setOptionDialogVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    // Mapping between question & question group id
    const [mapGrpId, setMapGrpId] = useState(null);

    const [response, setResponse] = useState({
        question_id: null,
        survey_name: null,
        question_group_name: "",
        question_group_id: "",
        question_key: "",
        question_type: "",
        question_name: "",
        sequence: maxSequence,
        data_status: 0,
        is_parent: null,
        is_mandatory: null,
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

    // Per Flow (Survey --> Quest Grp --> DSO)
    const [dates, setDates] = useState({}); // Store start and end dates for each Wilayah
    const [selectedKeys, setSelectedKeys] = useState({}); // Store selected keys (checked data)

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
        _response[`${name}`] = parseInt(val, 10);
        setResponse(_response);
    };

    const onCheckboxChange = (e, name) => {
        const val = e.checked ? 1 : 0;
        let _response = { ...response };
        _response[`${name}`] = parseInt(val, 10);

        if (_response.sequence === 1 && name !== "is_parent") {
            _response.is_parent = 1;
        }
        setResponse(_response);
    };

    const onDataStatusChange = (e, name) => {
        const val = e.value ? 1 : 0;
        let _response = { ...response };
        _response[`${name}`] = parseInt(val, 10);
        setResponse(_response);
    };

    /**
     * Fetch Questions API
     */
    const getQuestions = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/questions");
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
            setLoading(true);
            const response = await axios.get("/questionGroups");
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
            setLoading(true);
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
    }, response);

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

    const getMaxSequence = (questions) => {
        if (questions.length > 0) {
            // Find the maximum sequence value in the filtered questions
            return Math.max(...questions.map((q) => q.sequence || 0)) + 1;
        } else {
            return 1; // Default to 1 if there are no questions
        }
    };

    useEffect(() => {
        filterQuestionsByGroupName();
    }, [updateUI]);

    // Page 1
    const handleSurveyClick = (newSurvey) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            survey_id: newSurvey.survey_id,
            survey_name: newSurvey.survey_name,
        }));
    };

    const handleCustomSurveySubmit = async () => {
        setSubmitted(true);

        if (customSurvey.trim()) {
            try {
                const payload = {
                    survey_name: customSurvey,
                    data_status: customSurveyStatus,
                };

                const result = await axios.post("/addSurvey", payload);

                if (result.status === 200 && result.data.status === 1) {
                    const newSurvey = result.data.data;

                    // Update the surveys state with the new survey
                    setSurveys((prevSurveys) => [...prevSurveys, newSurvey]);

                    // Set the newly created survey as the selected one
                    handleSurveyClick(newSurvey);

                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: `Survey ${newSurvey.survey_name} Created`,
                        life: 2000,
                    });

                    // Close the dialog
                    setQuestionDialog(false);
                } else {
                    throw new Error(
                        result.data.message || "Failed to create survey"
                    );
                }
            } catch (error) {
                console.error("There was an error creating the survey!", error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        error.response?.data?.message ||
                        "Failed to create survey",
                    life: 3000,
                });
            }
        }
    };

    // Page 2: New Question Group (submit)
    const handleQuestionGroupClick = (group) => {
        setResponse((prevResponse) => ({
            ...prevResponse,
            question_group_name: group.question_group_name,
        }));
        setUpdateUI(!updateUI);
    };

    // Page 2: New Question Group (handle)
    const handleCustomQuestionGroupSubmit = async () => {
        setSubmittedQuestion(true);

        if (customQuestionGroup.trim()) {
            const additionalString = `${response.survey_name} - `;
            const totalString = additionalString + customQuestionGroup;

            try {
                const payload = {
                    question_group_name: totalString,
                    survey_name: response.survey_name,
                    data_status: customQuestionGroupStatus,
                };

                const result = await axios.post("/addQuestionGroup", payload);

                const newQGrp = result.data.data || result.data.data;

                if (result.status === 200 && result.data.status === 1) {
                    const newQuestionGroup = result.data.data;

                    const surveyQGrpPayload = {
                        survey_id: response.survey_id,
                        question_group_id: newQuestionGroup.question_group_id,
                        sequence: 1, // Set default sequence value as 1
                        data_status: 1, // Set default data_status value as 1
                    };

                    const surveyQGrpResult = await axios.post(
                        "/addSurveyQuestionGroup",
                        surveyQGrpPayload
                    );

                    if (
                        surveyQGrpResult.status === 200 &&
                        surveyQGrpResult.data.status === 1
                    ) {
                        setSurveyQuestionGroups((prevGroups) => [
                            ...prevGroups,
                            newQuestionGroup,
                        ]);
                        handleQuestionGroupClick(newQuestionGroup);

                        toast.current.show({
                            severity: "success",
                            summary: "Successful",
                            detail: `Question Group ${newQuestionGroup.question_group_name} Created`,
                            life: 2000,
                        });

                        setQuestionGroupDialog(false);
                    } else {
                        throw new Error(
                            surveyQGrpResult.data.message ||
                                "Failed to create survey question group"
                        );
                    }
                } else {
                    throw new Error(
                        result.data.message || "Failed to create question group"
                    );
                }
            } catch (error) {
                console.error(
                    "There was an error creating the question group!",
                    error
                );
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        error.response?.data?.message ||
                        "Failed to create question group",
                    life: 3000,
                });
            }
        }
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
            response.question_group_id
        ) {
            let _questions = [...questions];
            let _response = { ...response };

            if (_response.sequence === 1) {
                _response.is_parent = 1;
            }

            var formData = new FormData();
            formData.append("question_group_id", _response.question_group_id);
            formData.append("question_name", _response.question_name);
            formData.append(
                "question_group_name",
                _response.question_group_name
            );
            formData.append("question_key", _response.question_key);
            formData.append("question_type", _response.question_type);
            formData.append("sequence", _response.sequence);
            formData.append("data_status", parseInt(_response.data_status, 10));
            formData.append("is_parent", _response.is_parent);
            formData.append("is_mandatory", _response.is_mandatory);

            console.log("Form state before inserting");
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const index = findIndexByID(_response.question_id);

            try {
                let result;

                // Update question
                if (index >= 0 && editState) {
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
                        setQuestionDialog(false);
                        setUpdateUI((prev) => !prev);
                        getQuestions();
                        filterQuestionsByGroupName();
                    }
                } else {
                    // New Question

                    result = await axios.post("/addQuestion", formData);
                    if (result.status === 200) {
                        // This worked in updating UI
                        // _questions.push(_response);

                        // New Approach:
                        const newQuestion = result.data.data || result.data;
                        const mergedQuestion = {
                            ..._response,
                            question_id: newQuestion.question_id,
                            question_key: newQuestion.question_key,
                            option_1: newQuestion.option_1,
                            option_1_flow: newQuestion.option_1_flow,
                            option_2: newQuestion.option_2,
                            option_2_flow: newQuestion.option_2_flow,
                            option_3: newQuestion.option_3,
                            option_3_flow: newQuestion.option_3_flow,
                            option_4: newQuestion.option_4,
                            option_4_flow: newQuestion.option_4_flow,
                            option_5: newQuestion.option_5,
                            option_5_flow: newQuestion.option_5_flow,
                            option_6: newQuestion.option_6,
                            option_6_flow: newQuestion.option_6_flow,
                            option_7: newQuestion.option_7,
                            option_7_flow: newQuestion.option_7_flow,
                            option_8: newQuestion.option_8,
                            option_8_flow: newQuestion.option_8_flow,
                            option_9: newQuestion.option_9,
                            option_9_flow: newQuestion.option_9_flow,
                            question_group_name: _response.question_group_name,
                        };

                        _questions.push(mergedQuestion);

                        console.log("Merged q", mergedQuestion);
                        toast.current.show({
                            severity: "success",
                            summary: "Successful",
                            detail: `Question ${newQuestion.sequence} Created`,
                            life: 2000,
                        });

                        setUpdateUI((prev) => !prev);
                        setQuestionDialog(false);
                    }
                }
            } catch (error) {
                console.error("There was an error saving the question!", error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        error.response?.data?.message ||
                        "Failed to save question",
                    life: 3000,
                });
            }
            setQuestions(_questions);
            setEditState(false);
            setUpdateUI((prev) => !prev);
        }
    };

    const showDialog = () => {
        setQuestionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setQuestionDialog(false);
        setEditState(false);
    };

    const hideDeleteQuestionDialog = () => {
        setDeleteQuestionDialog(false);
        setEditState(false);
    };

    const doSaveDeleteQuestion = async () => {
        let _response = { ...response };
        const index = findIndexByID(_response.question_id);

        let _questions = [...questions];

        var formData = new FormData();
        formData.append("question_group_id", _response.question_group_id);
        formData.append("question_name", _response.question_name);
        formData.append("question_key", _response.question_key);
        formData.append("question_type", _response.question_type);
        formData.append("sequence", _response.sequence);
        formData.append("data_status", parseInt(_response.data_status, 10));
        formData.append("is_parent", _response.is_parent);
        formData.append("is_mandatory", _response.is_mandatory);

        try {
            // Set loading state to true and show loading toast with spinner
            setLoading(true);
            toast.current.show({
                severity: "info",
                summary: "Loading",
                detail: (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ProgressSpinner
                            style={{ width: "20px", height: "20px" }}
                            strokeWidth="5"
                        />
                        <span style={{ marginLeft: "8px" }}>
                            Processing your request...
                        </span>
                    </div>
                ),
                life: 2000,
            });

            const result = await axios.post(
                `/editQuestion/${_response.question_id}`,
                formData
            );

            const newQuestion = result.data.data || result.data;

            if (result.status === 200) {
                _questions[index] = { ..._response, ...newQuestion };
                setQuestions(_questions);

                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: `Question ${_response.sequence} Activity Updated`,
                    life: 2000,
                });

                setUpdateUI((prev) => !prev);
                hideDeleteQuestionDialog();
                setEditState(false);
            }
        } catch (error) {
            console.error("There was an error updating the question!", error);

            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    error.response?.data?.message || "Failed to save question",
                life: 3000,
            });
            setQuestions(_questions);
            setEditState(false);
            setUpdateUI((prev) => !prev);
        } finally {
            // Set loading state to false
            setLoading(false);
        }
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
                data_status: 0,
            }));
            setUpdateUI((prev) => !prev);
            setEditState(false);
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
            setEditState(false);
            getQuestions();
            filterQuestionsByGroupName();
        }
    };

    // Delete A Question
    const deleteQuestionDialogFooter = (
        <>
            <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div className="p-1">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        iconPos="left"
                        className="rounded"
                        outlined
                        onClick={hideDeleteQuestionDialog}
                    />
                </div>
                <div className="p-1">
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        iconPos="left"
                        className="rounded"
                        outlined
                        onClick={doSaveDeleteQuestion}
                    />
                </div>
                <div className="p-1 ms-auto">
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        rounded
                        iconPos="left"
                        severity="danger"
                        className="rounded"
                        onClick={deleteQuestion}
                    />
                </div>
            </div>
        </>
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
                    data_status: 0,
                }));
                // getQuestions();
                // filterQuestionsByGroupName();
            }
            toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "Selected Questions Deleted",
                life: 2000,
            });
            setUpdateUI((prev) => !prev);
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
        setEditState(true);
    };

    // Do Delete Questions
    const confirmDeleteSelected = () => {
        setDeleteQuestionsDialog(true);
        filterQuestionsByGroupName();
    };

    const reorderState = () => {
        setIsReordering((prevState) => !prevState);
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

    // Footer for: Step1 (Add Survey Type/Name)
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
                // disabled={!customSurvey.trim()}
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
                    onClick={async () => {
                        await saveQuestion();
                        setUpdateUI((prev) => !prev);
                    }}
                />
            </div>
        </React.Fragment>
    );

    const openNew = () => {
        // Max Sequence initialization
        const maxSeq = getMaxSequence(filteredQuestions);
        setMaxSequence(maxSeq);
        setResponse((prevResponse) => ({
            ...prevResponse,
            ...initialEmptyQuestion,
            sequence: maxSeq,
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
                reorderState={reorderState}
                isReordering={isReordering}
            />
        );
    };

    const rightToolbarTemplate = () => {
        return <RightToolbar exportCSV={exportCSV} />;
    };

    const isParentBodyTemplate = (rowData) => {
        const isParent = rowData.is_parent === 1 ? 1 : 0;
        const iconClassName = classNames("pi", {
            "pi-check text-success": isParent,
            "pi-minus text-danger": !isParent,
        });

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
        const iconClassName = classNames("pi", {
            "pi-check text-success": isMandatory,
            "pi-minus text-danger": !isMandatory,
        });

        return (
            <div
                className="d-inline-flex align-items-center justify-content-center"
                style={{ width: "2rem", height: "2rem" }}
            >
                <i className={iconClassName} style={{ fontSize: "20px" }}></i>
            </div>
        );
    };

    const isActiveBodyTemplate = (rowData) => {
        const isActive = rowData.data_status === 1 ? 1 : 0;
        const iconClassName = classNames("pi", {
            "pi-check text-success": isActive,
            "pi-minus text-danger": !isActive,
        });

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
                    ...updatedOptions,
                };

                setQuestions(_questions);

                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: `Options for Question ${updatedOptions.sequence} Updated`,
                    life: 2000,
                });

                setResponse((prevResponse) => ({
                    ...prevResponse,
                    question_type: "",
                    question_name: "",
                    sequence: null,
                    data_status: 0,
                    is_parent: 0,
                    is_mandatory: 0,
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
            setResponse((prevResponse) => ({
                ...prevResponse,
                question_type: "",
                question_name: "",
                sequence: null,
                data_status: 0,
                is_parent: 0,
                is_mandatory: 0,
            }));
            setUpdateUI(!updateUI);
        }
    };

    const onRowReorder = async (e) => {
        const reorderedQuestions = e.value;
        setQuestions(reorderedQuestions);

        console.log("Reordered Questions", reorderedQuestions);

        // Update the sequence and question_key for each question
        const updatedQuestions = reorderedQuestions.map((question, index) => {
            const newSequence = index + 1; // Sequence starts from 1
            return {
                ...question,
                sequence: newSequence,
                question_key: `${question.question_group_id}#${newSequence}`,
                is_parent: newSequence === 1 ? 1 : 0,
            };
        });

        setQuestions(updatedQuestions); // Update the state with the reordered questions

        try {
            // Optionally, make an API call to save the updated order in the backend
            for (let i = 0; i < updatedQuestions.length; i++) {
                const question = updatedQuestions[i];
                const formData = new FormData();
                formData.append(
                    "question_group_id",
                    question.question_group_id
                );
                formData.append("question_name", question.question_name);
                formData.append("question_type", question.question_type);
                formData.append("sequence", question.sequence);
                formData.append("data_status", question.data_status);
                formData.append("is_parent", question.is_parent);
                formData.append("is_mandatory", question.is_mandatory);
                formData.append("question_key", question.question_key);

                const result = await axios.post(
                    `/editQuestion/${question.question_id}`,
                    formData
                );

                if (result.status !== 200) {
                    throw new Error(
                        `Failed to update question ID ${question.question_id}`
                    );
                }
            }

            // Show a success toast
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Question sequences updated successfully",
                life: 3000,
            });
        } catch (error) {
            console.error("Error updating sequences:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    error.response?.data?.message ||
                    "Failed to edit question sequence",
                life: 3000,
            });
        } finally {
            setUpdateUI((prev) => !prev);
        }
    };

    const handleDateChange = (wilayah, newDates) => {
        setDates((prevDates) => ({
            ...prevDates,
            [wilayah]: newDates,
        }));
    };

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
    };

    return (
        <>
            <BreadcrumbComponent />
            <Toast ref={toast} />
            <div className="card d-flex justify-content-center">
                <Stepper ref={stepperRef} style={{ marginTop: "2rem" }}>
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
                                                            ? "btn-secondary"
                                                            : "btn-outline-secondary"
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
                                                        ? "btn-outline-secondary"
                                                        : "btn-secondary"
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

                                            {/* Add New Survey Dialog */}
                                            <SurveyDialog
                                                visible={questionDialog}
                                                onHide={hideDialog}
                                                customSurvey={customSurvey}
                                                customSurveyStatus={
                                                    customSurveyStatus
                                                }
                                                setCustomSurveyStatus={
                                                    setCustomSurveyStatus
                                                }
                                                submitted={submitted}
                                                footer={questionDialogFooter}
                                                onSurveyInputChange={
                                                    onSurveyInputChange
                                                }
                                            />
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
                                    onClick={() => [
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        }),
                                        stepperRef.current.nextCallback(),
                                    ]}
                                />
                            </div>
                        </div>
                    </StepperPanel>

                    {/* Step 2 - Question Group Name */}
                    <StepperPanel header="Question Group">
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
                                        {/* Button Options */}
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
                                                                ? "btn-secondary"
                                                                : "btn-outline-secondary"
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
                                                        ? "btn-outline-secondary"
                                                        : "btn-secondary"
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

                                            {/* Add Question Group Dialog */}
                                            <QuestionGroupDialog
                                                visible={questionGroupDialog}
                                                onHide={hideQuestionGroupDialog}
                                                customQuestionGroup={
                                                    customQuestionGroup
                                                }
                                                setCustomQuestionGroup={
                                                    setCustomQuestionGroup
                                                }
                                                customQuestionGroupStatus={
                                                    customQuestionGroupStatus
                                                }
                                                setCustomQuestionGroupStatus={
                                                    setCustomQuestionGroupStatus
                                                }
                                                submitted={submittedQuestion}
                                                footer={
                                                    questionGroupDialogFooter
                                                }
                                                onQuestionGroupInputChange={
                                                    onQuestionGroupInputChange
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <PageControlButtons
                                showBack={true}
                                backLabel="Back"
                                onBackClick={() =>
                                    stepperRef.current.prevCallback()
                                }
                                showNext={true}
                                doneLabel="Next"
                                onNextClick={() => {
                                    stepperRef.current.nextCallback();
                                    setUpdateUI((prev) => !prev);
                                }}
                                disabledNext={
                                    response.question_group_name === ""
                                }
                            />
                        </div>
                    </StepperPanel>

                    {/* Step 3 - Add Question */}
                    <StepperPanel header="Questions Details">
                        <Step3Header
                            selectedQuestionGroup={response.question_group_name}
                            initialSize={size}
                            onSizeChange={(newSize) => setSize(newSize)}
                            questionGroups={surveyQuestionGroups}
                            onQuestionGroupChange={handleQuestionGroupClick}
                            response={response}
                        />
                        <Toolbar
                            className="mb-4"
                            left={leftToolbarTemplate}
                            right={rightToolbarTemplate}
                        ></Toolbar>

                        <DataTable
                            ref={dt}
                            value={filteredQuestions}
                            size={size}
                            selection={selectedQuestions}
                            onSelectionChange={(e) =>
                                setSelectedQuestions(e.value)
                            }
                            paginator
                            paginatorLeft={paginatorLeft}
                            paginatorRight={paginatorRight}
                            rows={5}
                            sortField="sequence"
                            // sortOrder={1}
                            removableSort
                            filters={filters}
                            stripedRows
                            selectionMode={isReordering ? null : "multiple"}
                            header={header}
                            rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="{first} to {last} of {totalRecords} questions"
                            className="p-datatable-gridlines"
                            reorderableRows={isReordering}
                            onRowReorder={onRowReorder}
                        >
                            {isReordering && (
                                <Column
                                    rowReorder={isReordering}
                                    style={{ width: "5rem" }}
                                    bodyStyle={{ textAlign: "center" }}
                                />
                            )}
                            {!isReordering && (
                                <Column
                                    selectionMode="multiple"
                                    exportable={false}
                                    style={{ width: "4rem" }}
                                    className="border-right"
                                />
                            )}
                            <Column
                                field="sequence"
                                header="Sequence"
                                style={{ width: "2rem" }}
                                sortable
                                className="border-left border-right"
                                bodyStyle={{ textAlign: "center" }}
                            />
                            <Column
                                field="question_id"
                                header="ID"
                                style={{ width: "2rem" }}
                                sortable
                                className="border-left border-right"
                            />
                            <Column
                                field="question_name"
                                header="Name"
                                style={{ width: "20rem" }}
                                className="border-left border-right"
                                sortable
                            />
                            <Column
                                field="question_type"
                                header="Type"
                                style={{ width: "4rem" }}
                                sortable
                                className="border-left border-right"
                            />
                            <Column
                                field="data_status"
                                header="Active?"
                                sortable
                                style={{ width: "4rem" }}
                                body={isActiveBodyTemplate}
                                bodyStyle={{ textAlign: "center" }}
                                className="border-left border-right"
                            />
                            <Column
                                field="is_parent"
                                header="Parent?"
                                sortable
                                style={{ width: "4rem" }}
                                body={isParentBodyTemplate}
                                bodyStyle={{ textAlign: "center" }}
                                className="border-left border-right"
                            />
                            <Column
                                field="is_mandatory"
                                header="Mandatory?"
                                sortable
                                style={{ width: "4rem" }}
                                body={isMandatoryBodyTemplate}
                                bodyStyle={{ textAlign: "center" }}
                                className="border-left border-right"
                            />
                            <Column
                                body={optionsBodyTemplate}
                                header="Options"
                                exportable={false}
                                style={{ width: "4rem" }}
                                bodyStyle={{ textAlign: "center" }}
                                className="border-left border-right"
                            />
                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: "12rem" }}
                                bodyStyle={{ textAlign: "center" }}
                                className="border-left border-right"
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
                            onCheckboxChange={onCheckboxChange}
                            onDataStatusChange={onDataStatusChange}
                        />

                        {/* Delete a Question Dialog */}
                        <Dialog
                            visible={deleteQuestionDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteQuestionDialogFooter}
                            onHide={hideDeleteQuestionDialog}
                        >
                            <div className="confirmation-content d-flex">
                                <i
                                    className="pi pi-exclamation-triangle me-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {question && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{question.question_name}</b>?
                                        <br></br>
                                        <div className="mt-2">
                                            You can change the active state
                                            instead
                                            <br></br>
                                            <InputSwitch
                                                inputId="data_status"
                                                checked={
                                                    response.data_status === 1
                                                }
                                                onChange={(e) =>
                                                    onDataStatusChange(
                                                        e,
                                                        "data_status"
                                                    )
                                                }
                                            />
                                        </div>
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
                            updateResponse={updateResponseOptions}
                            questions={questions}
                        />

                        <PageControlButtons
                            showBack={true}
                            backLabel="Back"
                            onBackClick={() =>
                                stepperRef.current.prevCallback()
                            }
                            showNext={true}
                            doneLabel="Next"
                            onNextClick={() =>
                                stepperRef.current.nextCallback()
                            }
                        />
                    </StepperPanel>

                    {/* Step 4 - DSO List */}
                    <StepperPanel header="DSO Group">
                        <div className="rounded surface-ground flex-auto font-medium mx-5">
                            <h5 className="text-muted">Step 4</h5>
                            <h1>Pilih DSO Untuk Di Survey</h1>
                            {response.survey_name !== null &&
                                response.question_group_name !== null && (
                                    <p>{`${response.survey_name} (${response.question_group_name})`}</p>
                                )}

                            <div className="d-flex justify-content-center">
                                <DSOSelection
                                    dates={dates}
                                    onDateChange={handleDateChange}
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={handleSelectionChange}
                                />
                            </div>
                        </div>

                        <div className="d-flex pt-4 justify-content-start mx-5">
                            <Button
                                label="Back"
                                className="rounded"
                                icon="pi pi-arrow-left"
                                iconPos="right"
                                severity="secondary"
                                onClick={() => {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    }),
                                        stepperRef.current.prevCallback();
                                }}
                            />
                        </div>
                    </StepperPanel>
                </Stepper>
            </div>
        </>
    );
}
