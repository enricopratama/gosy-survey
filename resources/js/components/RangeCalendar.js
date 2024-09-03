import React, { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import "../../css/DSOSelection.css";

export default function RangeCalendar({ dates, onDateChange }) {
    const [localDates, setLocalDates] = useState(dates);

    // console.log("Local Dates", localDates);

    useEffect(() => {
        setLocalDates(dates);
    }, [dates]);

    const handleDateChange = (e) => {
        setLocalDates(e.value);
        onDateChange(e.value);
    };

    return (
        <div className="card flex justify-content-center calendar-container">
            <Calendar
                value={localDates}
                onChange={handleDateChange}
                selectionMode="range"
                readOnlyInput
                placeholder="Select active survey period"
                hideOnRangeSelection
                style={{ minWidth: "20vw" }}
                // showButtonBar
            />
        </div>
    );
}
