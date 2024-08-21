import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

export default function OptionsDialog({
    visible,
    onHide,
    selectedRow,
    updateResponse,
    questions,
}) {
    const [optionsData, setOptionsData] = useState([]);

    // Extract question keys from the questions prop
    const questionKeys = ["0", ...questions.map((q) => q.question_key)].sort(
        (a, b) => {
            const partsA = a
                .split(/(\d+)/)
                .map((part) => (isNaN(part) ? part : parseInt(part, 10)));
            const partsB = b
                .split(/(\d+)/)
                .map((part) => (isNaN(part) ? part : parseInt(part, 10)));

            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                if (partsA[i] < partsB[i]) return -1;
                if (partsA[i] > partsB[i]) return 1;
            }
            return 0;
        }
    );

    // Function to reformat options data from selectedRow
    const extractOptionsData = (row) => {
        const extractedOptions = [];

        if (row) {
            for (let i = 1; i <= 9; i++) {
                extractedOptions.push({
                    option_num: `option_${i}`,
                    option_data: row[`option_${i}`] || "",
                    option_flow: row[`option_${i}_flow`] || "",
                });
            }
        }

        return extractedOptions;
    };

    useEffect(() => {
        const options = extractOptionsData(selectedRow);
        setOptionsData(options);
    }, [selectedRow]);

    const onRowEditComplete = (e) => {
        let _optionsData = [...optionsData];
        let { newData, index } = e;

        _optionsData[index] = newData;

        setOptionsData(_optionsData);
    };

    const handleSave = () => {
        const updatedResponse = { ...selectedRow };
        optionsData.forEach((data) => {
            updatedResponse[data.option_num] =
                data.option_data !== "" ? data.option_data : null;
            updatedResponse[`${data.option_num}_flow`] =
                data.option_flow !== "" ? data.option_flow : null;
        });

        updateResponse(updatedResponse);
        onHide();
    };

    const textEditor = (options) => (
        <InputText
            type="text"
            value={options.value || ""}
            onChange={(e) => options.editorCallback(e.target.value)}
        />
    );

    const optionFlowsEditor = (options) => {
        return (
            <Dropdown
                value={options.value || ""}
                options={questionKeys}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select a Question Key"
                panelStyle={{ maxHeight: "600px" }}
                editable
                filter
            />
        );
    };

    const dialogFooterTemplate = () => (
        <div className="mt-2">
            <Button
                label="Close"
                className="rounded me-2"
                icon="pi pi-check"
                outlined
                onClick={handleSave}
            />
        </div>
    );

    return (
        <Dialog
            header="Manage Options"
            visible={visible}
            style={{ width: "50vw" }}
            maximizable
            modal
            contentStyle={{ height: "80vh" }}
            onHide={onHide}
            footer={dialogFooterTemplate()}
        >
            <div className="card p-fluid">
                <DataTable
                    value={optionsData}
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: "10rem" }}
                    stripedRows
                    showGridlines
                >
                    <Column
                        field="option_num"
                        style={{ width: "5%" }}
                        body={(rowData) => (
                            <strong>{rowData.option_num}</strong>
                        )}
                    />
                    <Column
                        field="option_data"
                        header="Option Data"
                        editor={(options) => textEditor(options)}
                        style={{ width: "5%" }}
                    />
                    <Column
                        field="option_flow"
                        header="Option Flow"
                        editor={(options) => optionFlowsEditor(options)}
                        style={{ width: "5%" }}
                    />
                    <Column
                        rowEditor={true}
                        headerStyle={{ width: "10%" }}
                        bodyStyle={{ textAlign: "right" }}
                    />
                </DataTable>
            </div>
        </Dialog>
    );
}
