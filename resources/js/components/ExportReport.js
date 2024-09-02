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
        <Button type="button" icon="pi pi-download" text onClick={exportCSV} />
    );

    // Process answers to match the DataTable format
    const processAnswers = () => {
        const groupedAnswers = {};

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

        // Grouping for each column to have question and
        return Object.values(groupedAnswers).map((entry) => {
            questions.forEach((question) => {
                if (!entry.questions[`question_${question.question_id}`]) {
                    entry.questions[`question_${question.question_id}`] = "";
                }
            });
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

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return <RightToolbar exportCSV={exportCSV} />;
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || "";
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS },
        }));
        setGlobalFilterValue(value);
    };

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
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                stripedRows
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} to {last} of {totalRecords} questions"
                className="p-datatable-gridlines"
                filters={filters}
                globalFilterFields={[
                    "customer_name",
                    "customer_address",
                    "survey_datetime",
                ]}
            >
                <Column
                    field="customer_name"
                    header="Customer Name"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                />
                <Column
                    field="customer_address"
                    header="Customer Address"
                    style={{ minWidth: "200px" }}
                    className="border-right"
                />
                <Column
                    field="survey_datetime"
                    header="Survey Date"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                />
                <Column
                    field="survey_name"
                    header="Survey Name"
                    style={{ minWidth: "150px" }}
                    className="border-right"
                />
                {renderColumns()}
            </DataTable>
        </div>
    );
}
