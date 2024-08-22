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
import axios from "axios";
import "../../css/DataTable.css";
import { Button } from "primereact/button";

export default function SurveyTable() {
    const toast = useRef(null);
    const dt = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [size, setSize] = useState("normal");

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
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const handleCreateGroup = () => {
        // Logic for creating a new question group
    };

    const handleEditGroup = () => {
        // Logic for editing the selected question group
    };

    const handleDeleteGroup = () => {
        // Logic for deleting the selected question group
    };

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
                onClick={handleCreateGroup}
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
            </div>
        </div>
    );
}
