import React, { useState, useEffect, useRef } from "react";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import axios from "axios";
import TableSizeSelector from "../handlers/TableSizeSelector";
import "../../css/DataTable.css";

export default function SurveyTable() {
    const toast = useRef(null);
    const dt = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [size, setSize] = useState("normal");

    const [editState, setEditState] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    // Dialog States
    const [addDialog, setAddDialog] = useState(false);

    const [editDialog, setEditDialog] = useState(false);

    // Question Group Response
    const [response, setResponse] = useState({
        question_group_name: "",
        data_status: 0,
    });

    // Survey Response
    const [surveyResponse, setSurveyResponse] = useState({
        survey_name: "",
        data_status: 0,
    });

    // Survey Question Group
    const [
        surveyQuestionGroupResponse,
        setSurveyQuestionGroupResponse,
    ] = useState({
        survey_id: null,
        sequence: 1,
        question_group_id: null,
        data_status: 0,
    });

    const initialEmptyQuestionGroup = {
        question_group_id: null,
        question_group_name: "",
        data_status: 0,
    };

    const initialEmptySurvey = {
        survey_name: "",
        data_status: 0,
    };

    const initialEmptySurveyQuestionGroup = {
        survey_id: null,
        sequence: 1,
        question_group_id: null,
        data_status: 0,
    };

    const [updateUI, setUpdateUI] = useState(false);

    // Filters
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        question_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [expandedRows, setExpandedRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { field: "question_id", header: "ID" },
        { field: "question_key", header: "Question Key" },
        { field: "question_group_id", header: "Question Group ID" },
        { field: "data_status", header: "Data Status" },
        { field: "question_type", header: "Question Type" },
        { field: "option_1", header: "Option 1" },
        { field: "option_1_flow", header: "Option 1 Flow" },
        { field: "option_2", header: "Option 2" },
        { field: "option_2_flow", header: "Option 2 Flow" },
        { field: "option_3", header: "Option 3" },
        { field: "option_3_flow", header: "Option 3 Flow" },
        { field: "option_4", header: "Option 4" },
        { field: "option_4_flow", header: "Option 4 Flow" },
        { field: "option_5", header: "Option 5" },
        { field: "option_5_flow", header: "Option 5 Flow" },
        { field: "option_6", header: "Option 6" },
        { field: "option_6_flow", header: "Option 6 Flow" },
        { field: "option_7", header: "Option 7" },
        { field: "option_7_flow", header: "Option 7 Flow" },
        { field: "option_8", header: "Option 8" },
        { field: "option_8_flow", header: "Option 8 Flow" },
        { field: "option_9", header: "Option 9" },
        { field: "option_9_flow", header: "Option 9 Flow" },
        {
            field: "survey_question_group_id",
            header: "Survey Question Group ID",
        },
        {
            field: "survey_question_group_sequence",
            header: "Survey Question Group Sequence",
        },
        {
            field: "question_group_data_status",
            header: "Question Group Active?",
        },
        { field: "survey_data_status", header: "Survey Active?" },
    ];

    const defaultVisibleColumns = [
        { field: "question_id", header: "ID" },
        { field: "question_key", header: "Question Key" },
        { field: "question_group_id", header: "Question Group ID" },
        { field: "data_status", header: "Data Status" },
        { field: "question_type", header: "Question Type" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
            setQuestions({
                ...initialEmptyQuestion,
            });
        } catch (error) {
            console.error("Error fetching the questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuestions();
    }, [updateUI]);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const onStatusChange = (e, name, isSurvey) => {
        const val = e.value ? 1 : 0; // Use e.value to get the boolean value directly

        if (isSurvey) {
            setSurveyResponse((prevSurveyResponse) => ({
                ...prevSurveyResponse,
                [name]: val,
            }));
        } else {
            setResponse((prevResponse) => ({
                ...prevResponse,
                [name]: val,
            }));
        }
    };

    // Add Data Handlers
    const onNewClick = () => {
        setSubmitted(false);
        setResponse(initialEmptyQuestionGroup);
        setAddDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAddDialog(false);
        setEditState(false);
    };

    const onSaveClick = async () => {
        setSubmitted(true);

        if (
            surveyResponse.survey_name.trim() &&
            response.question_group_name.trim()
        ) {
            try {
                // Step 1: Create the Survey
                const surveyFormData = new FormData();
                surveyFormData.append(
                    "survey_name",
                    surveyResponse.survey_name
                );
                surveyFormData.append(
                    "data_status",
                    surveyResponse.data_status
                );

                const surveyResult = await axios.post(
                    "/addSurvey",
                    surveyFormData
                );

                if (surveyResult.data && surveyResult.status === 200) {
                    const newSurvey =
                        surveyResult.data.data || surveyResult.data;
                    console.log("New Survey", newSurvey);
                    setSurveyResponse((prev) => ({
                        ...prev,
                        survey_id: newSurvey.survey_id,
                    }));

                    // Step 2: Create the Question Group
                    const questionGroupFormData = new FormData();
                    const combinedName = `${surveyResponse.survey_name} - ${response.question_group_name}`;
                    questionGroupFormData.append(
                        "question_group_name",
                        combinedName
                    );
                    questionGroupFormData.append(
                        "data_status",
                        parseInt(response.data_status, 10)
                    );

                    const questionGroupResult = await axios.post(
                        "/addQuestionGroup",
                        questionGroupFormData
                    );

                    if (
                        questionGroupResult.data &&
                        questionGroupResult.status === 200
                    ) {
                        const newQuestionGroup =
                            questionGroupResult.data.data ||
                            questionGroupResult.data;
                        console.log("New Question Group", newQuestionGroup);
                        const questionGroupId =
                            newQuestionGroup.question_group_id;

                        // Step 3: Add to Survey Question Group
                        const surveyQuestionGroupFormData = new FormData();
                        surveyQuestionGroupFormData.append(
                            "survey_id",
                            newSurvey.survey_id
                        );
                        surveyQuestionGroupFormData.append(
                            "question_group_id",
                            questionGroupId
                        );
                        surveyQuestionGroupFormData.append(
                            "sequence",
                            surveyQuestionGroupResponse.sequence
                        );
                        surveyQuestionGroupFormData.append(
                            "data_status",
                            surveyQuestionGroupResponse.data_status
                        );

                        await axios.post(
                            "/addSurveyQuestionGroup",
                            surveyQuestionGroupFormData
                        );

                        toast.current.show({
                            severity: "success",
                            summary: "Success",
                            detail: (
                                <div>
                                    Survey and Question Group Created
                                    <div>
                                        <a
                                            href="/survey/new"
                                            className="p-button p-component p-button-text"
                                            target="_blank"
                                            style={{
                                                marginTop: "10px",
                                                display: "inline-block",
                                            }}
                                        >
                                            <span className="p-button-label">
                                                View New Survey
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            ),
                            life: 3000,
                        });

                        // Reset the form
                        setResponse(initialEmptyQuestionGroup);
                        setSurveyResponse(initialEmptySurvey);
                        setSurveyQuestionGroupResponse(
                            initialEmptySurveyQuestionGroup
                        );
                        setUpdateUI(!updateUI);
                        setAddDialog(false);
                    }
                }
            } catch (error) {
                console.error(
                    "Error creating survey or question group:",
                    error
                );
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail:
                        error.response?.data?.message ||
                        "Failed to create survey",
                    life: 3000,
                });
            } finally {
                setUpdateUI(!updateUI);
            }
        }
    };

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
                    onClick={onSaveClick}
                />
            </div>
        </React.Fragment>
    );

    // Edit handler
    const onEditClick = (rowData) => {
        set;
    };

    // Delete Data Handlers
    const handleDeleteGroup = () => {};

    const onColumnToggle = (event) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(orderedSelectedColumns);
    };

    const header = (
        <div className="d-flex gap-2 justify-content-between align-items-center flex-wrap">
            <h4 className="m-0">All Questions</h4>
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

    const tableHeader = (
        <div className="mb-4">
            <Toolbar
                start={
                    <Button
                        label="New Group"
                        icon="pi pi-plus"
                        className="rounded"
                        onClick={onNewClick}
                        title="Create a new question group"
                    />
                }
                end={
                    <MultiSelect
                        value={visibleColumns}
                        options={columns}
                        optionLabel="header"
                        onChange={onColumnToggle}
                        style={{
                            width: "100%",
                            maxWidth: "22rem",
                        }}
                        display="chip"
                        filter
                        placeholder="Select Columns"
                        className=""
                        title="Select datatable columns"
                    />
                }
            />
        </div>
    );

    const rowHeaderTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">
                    {rowData.question_group_name}
                </span>
                <div className="ml-auto d-flex">
                    <Button
                        label="Edit"
                        icon="pi pi-pencil"
                        className="p-button-text rounded p-ml-2 outlined"
                        onClick={() => onEditClick(rowData)}
                    />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        className="p-button-danger p-button-text rounded p-ml-2"
                        onClick={() => handleDeleteGroup(rowData)}
                    />
                </div>
            </React.Fragment>
        );
    };

    const onRowReorder = (e) => {
        const reorderedQuestions = e.value;

        // Iterate through the reorderedQuestions to log the sequence
        reorderedQuestions.forEach((question, index) => {
            console.log(
                `Question ID: ${question.question_id}, New Sequence: ${
                    index + 1
                }`
            );
            // question.sequence = index + 1; // Update the sequence if needed
        });

        setQuestions(reorderedQuestions);
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <div className="ms-3 me-3">
                    <TableSizeSelector
                        initialSize={size}
                        dt={dt}
                        onSizeChange={(newSize) => setSize(newSize)}
                    />
                    {/* Place toolbar here */}
                    {tableHeader}
                    <DataTable
                        ref={dt}
                        value={questions}
                        dataKey="question_id"
                        size={size}
                        filters={filters}
                        header={header}
                        rowGroupHeaderTemplate={rowHeaderTemplate}
                        rowGroupMode="subheader"
                        groupRowsBy="question_group_name"
                        sortField="question_group_name"
                        sortOrder={1}
                        expandableRowGroups
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        tableStyle={{ minWidth: "50rem" }}
                        stripedRows
                        reorderableRows
                        onRowReorder={onRowReorder}
                        className="p-datatable-gridlines"
                    >
                        <Column rowReorder style={{ width: "1rem" }} />
                        <Column
                            field="sequence"
                            header="Sequence"
                            sortable
                            style={{ width: "1rem" }}
                            className="border-right"
                        />
                        <Column
                            field="question_name"
                            header="Question Name"
                            sortable
                            style={{ minWidth: "15rem" }}
                            className="border-right"
                        />
                        {visibleColumns.map((col) => (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                sortable
                                style={{ minWidth: "8rem" }}
                                className="border-left border-right"
                            />
                        ))}
                    </DataTable>

                    {/* Add New Question Group Dialog */}
                    <Dialog
                        visible={addDialog}
                        style={{ width: "32rem", maxHeight: "90vh" }}
                        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                        header="New Question Group"
                        modal
                        className="p-fluid"
                        footer={saveQuestionFooter}
                        onHide={hideDialog}
                    >
                        {/* Survey Name */}
                        <div className="field">
                            <label htmlFor="question_group_name">
                                Survey Name
                            </label>
                            <InputText
                                id="survey_name"
                                value={surveyResponse.survey_name || ""}
                                placeholder="eg. Survey Kapal Api"
                                onChange={(e) =>
                                    setSurveyResponse({
                                        ...surveyResponse,
                                        survey_name: e.target.value,
                                    })
                                }
                                required
                                autoFocus
                                className={
                                    submitted && !surveyResponse.survey_name
                                        ? "p-invalid"
                                        : ""
                                }
                            />
                            {submitted && !response.question_group_name && (
                                <small className="p-error">
                                    Question Group Name is required.
                                </small>
                            )}
                        </div>

                        {/* Survey Data Status */}
                        <div
                            className="field"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                            <div className="d-flex flex-row flex-wrap">
                                <label
                                    htmlFor="data_status"
                                    style={{
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                    }}
                                >
                                    Active Survey?
                                </label>
                                <InputSwitch
                                    inputId="data_status"
                                    checked={surveyResponse.data_status === 1}
                                    onChange={(e) =>
                                        onStatusChange(e, "data_status", true)
                                    }
                                />
                            </div>
                        </div>

                        <hr style={{ width: "100%", margin: "20px 0" }} />

                        {/* Question Group Name */}
                        <div className="field">
                            <label htmlFor="question_group_name">
                                Question Group Name
                            </label>
                            <InputText
                                id="question_group_name"
                                value={response.question_group_name}
                                onChange={(e) =>
                                    setResponse({
                                        ...response,
                                        question_group_name: e.target.value,
                                    })
                                }
                                placeholder="eg. Produk Kopi"
                                required
                                autoFocus
                                className={
                                    submitted && !response.question_group_name
                                        ? "p-invalid"
                                        : ""
                                }
                            />
                            {submitted && !response.question_group_name && (
                                <small className="p-error">
                                    Question Group Name is required.
                                </small>
                            )}
                        </div>

                        {/* Question Group Data Status */}
                        <div
                            className="field"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                            <div className="d-flex flex-row flex-wrap">
                                <label
                                    htmlFor="data_status"
                                    style={{
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                    }}
                                >
                                    Active Question Group?
                                </label>
                                <InputSwitch
                                    inputId="data_status"
                                    checked={response.data_status === 1}
                                    onChange={(e) =>
                                        onStatusChange(e, "data_status", false)
                                    }
                                />
                            </div>
                        </div>

                        <hr style={{ width: "100%", margin: "20px 0" }} />

                        {/* Survey Question Group Sequence */}
                        <div className="field">
                            <label htmlFor="sequence" className="font-bold">
                                Sequence
                            </label>
                            <InputNumber
                                id="sequence"
                                name="sequence"
                                placeholder="eg. 1"
                                value={surveyQuestionGroupResponse.sequence}
                                onChange={(e) =>
                                    setSurveyQuestionGroupResponse({
                                        ...surveyQuestionGroupResponse,
                                        sequence: e.value, // Update the sequence value
                                    })
                                }
                                required
                                className={
                                    submitted &&
                                    !surveyQuestionGroupResponse.sequence
                                        ? "p-invalid"
                                        : ""
                                }
                            />
                            {submitted &&
                                !surveyQuestionGroupResponse.sequence && (
                                    <small className="p-error">
                                        Sequence is required.
                                    </small>
                                )}
                        </div>

                        {/* Survey Question Group Data Status */}
                        <div
                            className="field"
                            style={{ marginTop: "20px", marginBottom: "20px" }}
                        >
                            <div className="d-flex flex-row flex-wrap">
                                <label
                                    htmlFor="data_status"
                                    style={{
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                    }}
                                >
                                    Active Survey Question Group?
                                </label>
                                <InputSwitch
                                    inputId="data_status"
                                    checked={response.data_status === 1}
                                    onChange={(e) =>
                                        setSurveyQuestionGroupResponse({
                                            ...surveyResponse,
                                            data_status: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </>
    );
}
