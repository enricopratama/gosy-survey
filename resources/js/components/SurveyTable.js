import React, { useState, useEffect, useRef } from "react";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import TableSizeSelector from "../handlers/TableSizeSelector";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import axios from "axios";
import "../../css/DataTable.css";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";

export default function SurveyTable() {
    const toast = useRef(null);
    const dt = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [size, setSize] = useState("normal");

    const [editState, setEditState] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    // Dialog States
    const [addDialog, setAddDialog] = useState(false);

    // Question Group Response
    const [response, setResponse] = useState({
        question_group_id: null,
        question_group_name: "",
        question_group_data_status: "",
    });

    // Survey Response
    const [surveyResponse, setSurveyResponse] = useState({
        survey_id: null,
        survey_name: "",
        survey_data_status: "",
    });

    const initialEmptyQuestionGroup = {
        question_group_id: null,
        question_group_name: "",
        question_group_data_status: "",
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

    const [visibleColumns, setVisibleColumns] = useState(columns);

    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
            // setQuestions({
            //     ...initialEmptyQuestion,
            // });
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

    // Input Change Handlers
    const onInputChange = (e, name, isSurvey = false) => {
        const val = (e.target && e.target.value) || "";
        if (isSurvey) {
            let _surveyResponse = { ...surveyResponse };
            _surveyResponse[`${name}`] = val;
            setSurveyResponse(_surveyResponse);
        } else {
            let _response = { ...response };
            _response[`${name}`] = val;
            setResponse(_response);
        }
    };

    const onStatusChange = (e, name, isSurvey = false) => {
        const val = e.checked ? 1 : 0;
        if (isSurvey) {
            let _surveyResponse = { ...surveyResponse };
            _surveyResponse[`${name}`] = val;
            setSurveyResponse(_surveyResponse);
        } else {
            let _response = { ...response };
            _response[`${name}`] = val;
            setResponse(_response);
        }
    };

    // Add Data Handlers
    const openNew = () => {
        setSubmitted(false);
        setResponse(initialEmptyQuestionGroup);
        setAddDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false); // True ? false
        setAddDialog(false);
        setEditState(false);
    };

    const handleCreateGroup = async () => {
        setSubmitted(true);

        if (response.question_group_name.trim()) {
            // Create a FormData object to store the form fields
            var formData = new FormData();
            formData.append(
                "question_group_name",
                response.question_group_name
            );
            formData.append(
                "question_group_data_status",
                response.question_group_data_status
            );

            try {
                // Send a POST request with the FormData
                const result = await axios.post("/addQuestionGroup", formData);

                if (result.data) {
                    setQuestions([...questions, result.data]);
                    setAddDialog(false);

                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Question Group Created",
                        life: 3000,
                    });

                    // Reset the form
                    setResponse(initialEmptyQuestionGroup);
                    setUpdateUI(!updateUI);
                }
            } catch (error) {
                console.error("Error creating the question group:", error);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to Create Question Group",
                    life: 3000,
                });
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
                    onClick={handleCreateGroup}
                />
            </div>
        </React.Fragment>
    );

    // Edit Data Handlers
    const handleEditGroup = () => {};

    // Delete Data Handlers
    const handleDeleteGroup = () => {};

    const onColumnToggle = (event) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(orderedSelectedColumns);
    };

    const tableHeader = (
        <div className="d-flex justify-content-between align-items-center ms-2 flex-wrap">
            <Button
                label="New"
                icon="pi pi-plus"
                className="rounded mb-2"
                onClick={openNew}
            />
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
                className="mt-2 mb-2"
            />
            <IconField iconPosition="left" className="me-3 mt-2">
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

    const rowHeaderTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">
                    {data.question_group_name}
                </span>
                <div className="ml-auto d-flex">
                    <Button
                        label="Edit"
                        icon="pi pi-pencil"
                        className="p-button-text rounded p-ml-2 outlined"
                        onClick={() => handleEditGroup(data)}
                    />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        className="p-button-danger p-button-text rounded p-ml-2"
                        onClick={() => handleDeleteGroup(data)}
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
                <TableSizeSelector
                    initialSize={size}
                    onSizeChange={(newSize) => setSize(newSize)}
                />
                <DataTable
                    ref={dt}
                    value={questions}
                    dataKey="question_id"
                    size={size}
                    filters={filters}
                    header={tableHeader}
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
                    header="Add New Question Group"
                    modal
                    className="p-fluid"
                    footer={saveQuestionFooter}
                    onHide={hideDialog}
                >
                    {/* Survey Name */}
                    <div className="field">
                        <label htmlFor="question_group_name">Survey Name</label>
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
                        style={{ marginTop: "35px", marginBottom: "35px" }}
                    >
                        <div className="d-flex flex-row flex-wrap">
                            <label
                                htmlFor="survey_data_status"
                                style={{
                                    fontWeight: "bold",
                                    marginRight: "10px",
                                }}
                            >
                                Active Survey?:
                            </label>
                            <InputSwitch
                                inputId="survey_data_status"
                                checked={surveyResponse.data_status === 1}
                                onChange={(e) =>
                                    onStatusChange(
                                        e,
                                        "survey_data_status",
                                        true
                                    )
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

                    {/* Question Group Dta Status */}
                    <div
                        className="field"
                        style={{ marginTop: "35px", marginBottom: "35px" }}
                    >
                        <div className="d-flex flex-row flex-wrap">
                            <label
                                htmlFor="question_group_data_status"
                                style={{
                                    fontWeight: "bold",
                                    marginRight: "10px",
                                }}
                            >
                                Active Question Group?:
                            </label>
                            <InputSwitch
                                inputId="question_group_data_status"
                                checked={
                                    response.question_group_data_status === 1
                                }
                                onChange={(e) =>
                                    onStatusChange(
                                        e,
                                        "question_group_data_status"
                                    )
                                }
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
}
