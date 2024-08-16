import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ProductService } from "./service/ProductService";

export default function RowEditingDemo() {
    const [products, setProducts] = useState(null);
    const options = [
        "option_1",
        "option_2",
        "option_3",
        "option_4",
        "option_5",
        "option_6",
        "option_7",
        "option_8",
        "option_9",
    ];

    useEffect(() => {
        ProductService.getProductsMini().then((data) => {
            // Hardcode the 'code' field with the values from the 'options' array
            const updatedProducts = data.map((product, index) => ({
                ...product,
                code: options[index], // Use the corresponding option if available
            }));
            setProducts(updatedProducts);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowEditComplete = (e) => {
        let _products = [...products];
        let { newData, index } = e;

        _products[index] = newData;

        setProducts(_products);
    };

    const textEditor = (options) => {
        return (
            <InputText
                type="text"
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        );
    };

    const priceEditor = (options) => {
        return (
            <InputNumber
                value={options.value}
                onValueChange={(e) => options.editorCallback(e.value)}
                mode="currency"
                currency="USD"
                locale="en-US"
            />
        );
    };

    const priceBodyTemplate = (rowData) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(rowData.price);
    };

    const codeBodyTemplate = (rowData) => {
        return <span style={{ fontWeight: "bold" }}>{rowData.code}</span>;
    };

    return (
        <div className="card p-fluid">
            <DataTable
                value={products}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                tableStyle={{ minWidth: "20rem" }}
            >
                <Column
                    body={codeBodyTemplate}
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="name"
                    header="Option"
                    editor={(options) => textEditor(options)}
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    field="price"
                    header="Flow"
                    body={priceBodyTemplate}
                    editor={(options) => priceEditor(options)}
                    style={{ width: "10%" }}
                ></Column>
                <Column
                    rowEditor={true}
                    headerStyle={{ width: "10%", minWidth: "2rem" }}
                    bodyStyle={{ textAlign: "center" }}
                ></Column>
            </DataTable>
        </div>
    );
}
