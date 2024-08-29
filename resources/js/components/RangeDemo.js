import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";

export default function RangeDemo({ dates, onDateChange }) {
    const [localDates, setLocalDates] = useState(dates); // Local state for this calendar

    useEffect(() => {
        setLocalDates(dates); // Update local state when the dates prop changes
    }, [dates]);

    const handleDateChange = (e) => {
        setLocalDates(e.value);
        onDateChange(e.value); // Pass the dates back to the parent component
    };

    return (
        <div className="card flex justify-content-center">
            <Calendar
                value={localDates}
                onChange={handleDateChange}
                selectionMode="range"
                readOnlyInput
                placeholder="Select active survey period."
                hideOnRangeSelection
                style={{ minWidth: "20vw" }}
                showButtonBar
            />
        </div>
    );
}
