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
import axios from "axios";
import TableSizeSelector from "../handlers/TableSizeSelector";
import "../../css/DataTable.css";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import tryCatch from "../hooks/tryCatch";
import { columns } from "../../data/Columns";
import { defaultVisibleColumns } from "../../data/Columns";

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
    const [editedQuestionGroupID, setEditedQuestionGroupID] = useState(null);

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
    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

    const getQuestions = async () => {
        const [response, error] = await tryCatch(axios.get("/questions"));
        if (error) {
            console.error("Error fetching the questions:", error);
        } else {
            setQuestions(response.data);
        }
        setLoading(false);
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
        setEditedQuestionGroupID(rowData.question_group_id);
    };

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

    const tableTopHeader = (
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
                            maxWidth: "20rem",
                        }}
                        display="chip"
                        filter
                        placeholder="Select Columns"
                        title="Select datatable columns"
                    />
                }
            />
        </div>
    );

    const rowHeaderTemplate = (rowData) => {
        const isEditing = editedQuestionGroupID === rowData.question_group_id;

        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">
                    {rowData.question_group_name} ({rowData.survey_name})
                    <div className="ml-auto d-flex">
                        {isEditing ? (
                            <Button
                                label="Close"
                                icon="pi pi-times"
                                className="p-button-text rounded p-ml-2 outlined"
                                onClick={() => {
                                    setEditedQuestionGroupID(null);
                                    setEditState(false);
                                }}
                            />
                        ) : (
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                className="p-button-text rounded p-ml-2 outlined"
                                onClick={() => {
                                    // setEditedQuestionGroupID(rowData.question_group_id);
                                    onEditClick(rowData);
                                    setEditState(true);
                                }}
                            />
                        )}
                        {/* <Button
                            label="Delete"
                            icon="pi pi-trash"
                            className="p-button-danger p-button-text rounded p-ml-2"
                            onClick={() => handleDeleteGroup(rowData)}
                        /> */}
                    </div>
                </span>
            </React.Fragment>
        );
    };

    const textEditor = (questions) => (
        <InputText
            type="text"
            value={questions.value || ""}
            onChange={(e) => questions.editorCallback(e.target.value)}
            style={{ width: "100%" }}
        />
    );

    const numberEditor = (questions) => (
        <InputText
            type="number"
            value={questions.value || ""}
            onChange={(e) => questions.editorCallback(e.target.value)}
            style={{ width: "50%" }}
        />
    );

    const onRowEditComplete = async (e) => {
        let _questions = [...questions];
        let { newData, index } = e;

        try {
            const result = await axios.post(
                `/editQuestion/${newData.question_id}`,
                newData
            );

            console.log("Result", result);

            if (result.status === 200) {
                _questions[index] = newData;
                setQuestions(_questions);

                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: `Question ID ${newData.question_id} updated successfully`,
                    life: 3000,
                });
            }
        } catch (error) {
            console.error("Error updating question:", error);

            toast.current.show({
                severity: "error",
                summary: "Error",
                detail:
                    error.response?.data?.message ||
                    `Failed to update Question ID ${newData.question_id}`,
                life: 3000,
            });
        } finally {
            setUpdateUI(!updateUI);
        }
    };

    // TODO: Fix sequence ordering in DataTable (order by is missed up)
    const onRowReorder = async (e) => {
        const reorderedQuestions = e.value;

        console.log("Reordered Questions", reorderedQuestions);

        // Filter questions belonging to the edited group
        const editedGroupQuestions = reorderedQuestions.filter(
            (question) => question.question_group_id === editedQuestionGroupID
        );

        // Update the sequence and question_key for each question in the edited group
        editedGroupQuestions.forEach((question, index) => {
            const newSequence = index + 1; // Sequence starts from 1
            question.sequence = newSequence;
            question.question_key = `${question.question_group_id}#${newSequence}`;
            question.is_parent = newSequence === 1 ? 1 : 0;
        });

        // console.log("Edited Group Questions", editedGroupQuestions);
        setQuestions(editedGroupQuestions);

        try {
            setLoading(true);
            if (editState) {
                // Make individual API calls to update each question using the /editQuestions route
                for (let i = 0; i < editedGroupQuestions.length; i++) {
                    const question = editedGroupQuestions[i];
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

                    console.log("result.data", result.data);

                    if (result.status !== 200) {
                        throw new Error(
                            `Failed to update question ID ${question.question_id}`
                        );
                    }
                    // Log the form data
                    for (let [key, value] of formData.entries()) {
                        console.log(`${key}: ${value}`);
                    }
                }

                // Show success toast once all updates are complete
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Question sequences updated successfully",
                    life: 3000,
                });
            }
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
            setLoading(false);
            // setQuestions(editedGroupQuestions);
            setUpdateUI((prev) => !prev); // Update: temporary fix
        }
    };

    const sequenceBodyTemplate = (rowData) => {
        const stockClassName = classNames(
            "d-inline-flex justify-content-center align-items-center rounded-circle font-weight-bold",
            {
                "bg-secondary font-weight-bold text-white":
                    rowData.sequence === 1,
            }
        );

        return (
            <div className={stockClassName} style={{ width: "25px" }}>
                {rowData.sequence}
            </div>
        ); // Custom width
    };

    //TODO: Fix Sort by sequence automatically error, need for reordering rows
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
                    {tableTopHeader}
                    <DataTable
                        ref={dt}
                        value={questions}
                        dataKey="question_id"
                        size={size}
                        filters={filters}
                        header={header}
                        rowGroupHeaderTemplate={rowHeaderTemplate}
                        rowGroupMode="subheader"
                        groupRowsBy="question_group_id"
                        sortField="sequence"
                        removableSort
                        expandableRowGroups
                        expandedRows={expandedRows}
                        onRowToggle={(e) => setExpandedRows(e.data)}
                        tableStyle={{ minWidth: "88vw" }}
                        reorderableRows
                        onRowReorder={onRowReorder}
                        className="p-datatable-gridlines"
                        editMode="row"
                        onRowEditComplete={onRowEditComplete}
                        selectionMode={editState}
                    >
                        <Column
                            field="sequence"
                            header="Sequence"
                            sortable
                            style={{ width: "10px" }}
                            editor={(question) => numberEditor(question)}
                            body={sequenceBodyTemplate}
                            bodyStyle={{ textAlign: "center" }}
                        />
                        <Column
                            field="question_key"
                            header="Question Key"
                            sortable
                            style={{ width: "10%" }}
                            editor={(question) => textEditor(question)}
                        />
                        <Column
                            field="question_name"
                            header="Question Name"
                            // sortable
                            style={{ minWidth: "20rem" }}
                            editor={(question) => textEditor(question)}
                        />

                        {visibleColumns.map((col) => (
                            <Column
                                key={col.field}
                                field={col.field}
                                header={col.header}
                                // sortable
                                style={{ minWidth: "4rem" }}
                                editor={(question) => textEditor(question)}
                            />
                        ))}
                        <Column
                            rowEditor
                            headerStyle={{ width: "10%" }}
                            bodyStyle={{ textAlign: "right" }}
                        />
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
