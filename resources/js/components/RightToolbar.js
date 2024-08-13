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
        />
    );
};

export default RightToolbar;
