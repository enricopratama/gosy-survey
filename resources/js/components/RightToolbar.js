import React from "react";
import { Button } from "primereact/button";

const RightToolbar = ({ exportCSV }) => {
    return (
        <div className="d-flex flex-wrap gap-2">
            <Button
                label="Export"
                icon="pi pi-upload"
                iconPos="left"
                onClick={exportCSV}
                className="rounded flex-fill w-100"
                title="Export this table"
                style={{ minWidth: "100%" }}
            />
        </div>
    );
};

export default RightToolbar;
