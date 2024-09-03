import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import RightToolbar from "./RightToolbar";
import { Toolbar } from "primereact/toolbar";
import "../../css/DataTable.css";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

export default function ExportReport({ survey_id }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [csvData, setCsvData] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const dt = useRef(null);

    // Fetch questions and answers for the survey
    const getSurveyData = async () => {
        try {
            setLoading(true);
            const questionResponse = await axios.get(
                `/surveyQuestions/${survey_id}`
            );
            setQuestions(questionResponse.data);

            const answerResponse = await axios.get(
                `/questionAnswers/${survey_id}`
            );
            setAnswers(answerResponse.data);
        } catch (error) {
            console.error(
                "There was an error fetching the survey data!",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSurveyData();
    }, []);

    const paginatorLeft = (
        <Button
            type="button"
            icon="pi pi-refresh"
            text
            onClick={getSurveyData}
        />
    );

    const paginatorRight = (
        <Button
            type="button"
            icon="pi pi-download"
            text
            onClick={exportDataFromDataTable}
        />
    );

    // Process answers to match the DataTable format
    const processAnswers = () => {
        const groupedAnswers = {}; // Group answers by customer

        // Grouping answer together, assigning to a customerKey
        answers.forEach((answer) => {
            const customerKey = `${answer.customer_code}-${answer.customer_name}`;
            if (!groupedAnswers[customerKey]) {
                groupedAnswers[customerKey] = {
                    ...answer,
                    questions: {},
                };
            }

            const cleanedAnswer = (answer.user_answer || "")
                .split("|")
                .join("")
                .trim();

            // Attach questions to answers
            groupedAnswers[customerKey].questions[
                `question_${answer.question_id}`
            ] = cleanedAnswer;
        });

        // Grouping for each column to have question and answer
        return Object.values(groupedAnswers).map((entry) => {
            questions.forEach((question) => {
                if (!entry.questions[`question_${question.question_id}`]) {
                    entry.questions[`question_${question.question_id}`] = "-";
                }
            });
            // Combines the original customer entry and the questions into a single object for each customer.
            return { ...entry, ...entry.questions };
        });
    };

    const renderColumns = () => {
        return questions.map((question) => (
            <Column
                key={question.question_id}
                field={`question_${question.question_id}`}
                header={question.question_name}
                style={{ minWidth: "200px" }}
                className="border-right"
            />
        ));
    };

    const exportDataFromDataTable = () => {
        if (dt.current) {
            const currentData = dt.current.getTable || []; // Access the data from DataTable's state
            console.log("Current Data:", currentData);

            // Example: Use the data for export
            exportCSVToExcel(currentData);
        } else {
            console.log("DataTable is not yet initialized.");
        }
    };

    const exportCSVToExcel = (data) => {
        import("xlsx").then((xlsx) => {
            // Use the provided data (instead of dt.current.value)
            const worksheet = xlsx.utils.json_to_sheet(data);

            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            const excelBuffer = xlsx.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            saveAsExcelFile(excelBuffer, "Survey_Report");
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                const EXCEL_TYPE =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                const EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], { type: EXCEL_TYPE });

                module.default.saveAs(
                    data,
                    `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
                );
            }
        });
    };

    const rightToolbarTemplate = () => {
        return <RightToolbar exportCSV={exportCSV} />;
    };

    const exportCSV = () => {
        const exportedCSV = dt.current.exportCSV();
        setCsvData(exportedCSV);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS },
        }));
        setGlobalFilterValue(value);
    };

    console.log("dt.current", dt.current);
    // console.log("dt.current.props", dt.current.props);
    // console.log("dt.current.props.value", dt.current.props.value);
    // console.log("dt.current.value", dt.current.value);

    return (
        <div className="text-center">
            <Toolbar
                className="mb-4"
                left={
                    <IconField iconPosition="left" className="me-3">
                        <InputIcon className="pi pi-search" />
                        <InputText
                            value={globalFilterValue}
                            type="search"
                            onChange={onGlobalFilterChange}
                            placeholder="Search..."
                        />
                    </IconField>
                }
                right={rightToolbarTemplate}
            ></Toolbar>
            <DataTable
                ref={dt}
                value={processAnswers()}
                loading={loading}
                paginator
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                stripedRows
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} to {last} of {totalRecords} questions"
                className="p-datatable-gridlines"
                filters={filters}
                globalFilterFields={[
                    "customer_name",
                    "customer_address",
                    "survey_datetime",
                    "survey_name",
                    "ASSM",
                    "Branch",
                    "salesman_name",
                    "company_code",
                    "customer_code",
                    "customer-name",
                    "company_address",
                    "outlet_class",
                    "kecamatan",
                ]}
                removableSort
            >
                <Column
                    header="No."
                    headerStyle={{ width: "3rem" }}
                    className="border-right"
                    body={(data, options) => `${options.rowIndex + 1}.`}
                    bodyStyle={{ textAlign: "center" }}
                />
                <Column
                    field="customer_name"
                    header="Customer Name"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="customer_address"
                    header="Customer Address"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="survey_datetime"
                    header="Survey Date"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="survey_name"
                    header="Survey Name"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="ASSM"
                    header="ASSM"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="Branch"
                    header="Branch"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="salesman_name"
                    header="Salesman Name"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="company_code"
                    header="Company Code"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="customer_code"
                    header="Customer Code"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="customer_name"
                    header="Company Name"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="customer_address"
                    header="Company Address"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="outlet_class"
                    header="Outlet Class"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                <Column
                    field="kecamatan"
                    header="Kecamatan"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                    sortable
                />
                {renderColumns()}
            </DataTable>
        </div>
    );
}
