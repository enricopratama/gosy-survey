import React, { useState, useEffect } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

// Must set state, and put size field in DataTable as a prop. Example:
/* <TableSizeSelector
    initialSize={size}
    onSizeChange={(newSize) => setSize(newSize)}
/> */

// For step 2
export default function TableSizeSelector({ initialSize, onSizeChange, dt }) {
    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const [sizeOptions] = useState([
        { label: "Small", value: "small" },
        { label: "Normal", value: "normal" },
        { label: "Large", value: "large" },
    ]);
    const [size, setSize] = useState(initialSize);

    useEffect(() => {
        const handleResize = () => {
            const newSize =
                window.innerHeight > 640 && window.innerWidth > 540
                    ? sizeOptions[1].value // "Normal" for tablets and larger
                    : sizeOptions[0].value; // "Small" for mobile
            setSize(newSize);
            onSizeChange(newSize);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [sizeOptions, onSizeChange]);

    const handleSizeChange = (e) => {
        setSize(e.value);
        onSizeChange(e.value);
    };

    return (
        <div className="d-flex justify-content-between mb-4 mt-4 p-toolbar p-component">
            <SelectButton
                value={size}
                onChange={handleSizeChange}
                options={sizeOptions}
                title="Select table size"
            />
            <Button
                label="Export"
                icon="pi pi-upload"
                iconPos="left"
                onClick={exportCSV}
                className="rounded"
                title="Export this table"
            />
        </div>
    );
}
