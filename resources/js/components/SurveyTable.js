import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputIcon } from "primereact/inputicon";
import { IconField } from "primereact/iconfield";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import LeftToolbar from "./LeftToolbar";
import RightToolbar from "./RightToolbar";
import TableSizeSelector from "../handlers/TableSizeSelector";
import "../../css/DataTable.css";
import { MultiSelect } from "primereact/multiselect";

export default function SurveyTable() {
    const toast = useRef(null);
    const dt = useRef(null);

    // Questions
    const [question, setQuestion] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState(null);
    const [questionDialog, setQuestionDialog] = useState(false);
    const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);
    const [deleteQuestionsDialog, setDeleteQuestionsDialog] = useState(false);

    const columns = [
        { field: "sequence", header: "Sequence" },
        { field: "question_id", header: "ID" },
        { field: "question_name", header: "Question Name" },
        { field: "question_key", header: "Question Key" },
        { field: "question_group_id", header: "Question Group ID" },
        { field: "data_status", header: "Status" },
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
    ];

    const [visibleColumns, setVisibleColumns] = useState(columns);

    const [expandedRows, setExpandedRows] = useState([]);

    const [loading, setLoading] = useState(true);

    const [submitted, setSubmitted] = useState(false);

    // Filters
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        question_id: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [editState, setEditState] = useState(false);

    const [size, setSize] = useState("normal"); // Default size is normal

    const initialEmptyQuestion = {
        question_key: "",
        question_group_id: null,
        sequence: null,
        question_name: "",
        question_type: "",
        data_status: null,
    };

    const getQuestions = async () => {
        try {
            const response = await axios.get("/api/questions");
            setQuestions(response.data);
            setQuestion({
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
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const openNew = () => {
        setQuestion({
            ...initialEmptyQuestion,
        });
        setSubmitted(false);
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

    const hideDeleteQuestionsDialog = () => {
        setDeleteQuestionsDialog(false);
        setEditState(false);
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

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].question_id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteQuestionsDialog(true);
        setEditState(false);
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

    const headerTemplate = (data) => {
        return (
            <React.Fragment>
                <span className="vertical-align-middle ml-2 font-bold line-height-3">
                    {data.question_group_name}
                </span>
            </React.Fragment>
        );
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
            <h4 className="m-0">Manage Questions</h4>
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
            />
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
                onClick={saveQuestion}
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

    const footerTemplate = (data) => {
        return (
            <React.Fragment>
                <td colSpan={5}>
                    <div className="flex justify-content-end font-bold w-full">
                        Total Questions:{" "}
                        {calculateQuestionTotal(data.question_group_name)}
                    </div>
                </td>
            </React.Fragment>
        );
    };

    const calculateQuestionTotal = (surveyName) => {
        let total = 0;

        if (questions) {
            for (let question of questions) {
                if (question.question_group_name === surveyName) {
                    total++;
                }
            }
        }

        return total;
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
        <div>
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
                    showGridlines
                    header={header}
                    rowGroupHeaderTemplate={headerTemplate}
                    rowGroupMode="subheader"
                    groupRowsBy="question_group_name"
                    sortField="question_group_name"
                    sortOrder={1}
                    expandableRowGroups
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    rowGroupFooterTemplate={footerTemplate}
                    tableStyle={{ minWidth: "50rem" }}
                    stripedRows
                    reorderableRows
                    onRowReorder={onRowReorder}
                    className="text-large"
                >
                    <Column rowReorder style={{ width: "3rem" }} />
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
            </div>
        </div>
    );
}
