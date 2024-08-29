import React, { useState } from "react";
import { Calendar } from "primereact/calendar";

export default function RangeDemo() {
    const [dates, setDates] = useState(null);

    return (
        <div className="card flex justify-content-center">
            <Calendar
                value={dates}
                onChange={(e) => setDates(e.value)}
                selectionMode="range"
                readOnlyInput
                placeholder="Select Survey Active Period"
                hideOnRangeSelection
                style={{ minWidth: "20vw" }}
            />
        </div>
    );
}
