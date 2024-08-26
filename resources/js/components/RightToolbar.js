import React from "react";
import { Button } from "primereact/button";

const RightToolbar = ({ exportCSV }) => {
    return (
        <Button
            label="Export"
            icon="pi pi-upload"
            iconPos="left"
            onClick={exportCSV}
            className="rounded"
            title="Export this table"
        />
    );
};

export default RightToolbar;
