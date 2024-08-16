import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function OptionsDialog({
    visible,
    onHide,
    selectedRow,
    updateResponse, // contains the updated response
}) {
    const [optionsData, setOptionsData] = useState([]);

    // Function to extract options data from selectedRow
    const extractOptionsData = (row) => {
        const extractedOptions = [];

        if (row) {
            for (let i = 1; i <= 9; i++) {
                extractedOptions.push({
                    option_num: `option_${i}`,
                    option_data: row[`option_${i}`] || "", // Leave empty if null
                    option_flow: row[`option_${i}_flow`] || "",
                });
            }
        }

        return extractedOptions;
    };

    useEffect(() => {
        // Call the extractOptionsData function and set the state
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

        updateResponse(updatedResponse); // Trigger the update response and POST request
        onHide(); // Close the dialog
    };

    const textEditor = (options) => (
        <InputText
            type="text"
            value={options.value || ""} // Leave empty if null
            onChange={(e) => options.editorCallback(e.target.value)}
        />
    );

    const dialogFooterTemplate = () => (
        <div className="mt-2">
            <Button
                label="Done"
                className="rounded me-2"
                icon="pi pi-check"
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
                        bodyStyle={{ textAlign: "center" }}
                    />
                    <Column
                        field="option_flow"
                        header="Option Flow"
                        editor={(options) => textEditor(options)}
                        style={{ width: "5%" }}
                        bodyStyle={{ textAlign: "center" }}
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
