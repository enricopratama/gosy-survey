import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import axios from "axios";
import "../../css/DSOSelection.css";
import RangeCalendar from "./RangeCalendar";

export default function DSOSelection({
    dates,
    onDateChange,
    selectedKeys,
    onSelectionChange,
}) {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [localDates, setLocalDates] = useState({});

    const handleDateChange = (wilayah, newDates) => {
        setLocalDates((prevDates) => ({
            ...prevDates,
            [wilayah]: newDates,
        }));
    };

    const getBranches = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/branches");
            const branches = response.data;

            const wilayahMap = {};

            branches.forEach((branch, index) => {
                const { Wilayah, BranchName, BranchCode } = branch;

                if (!wilayahMap[Wilayah]) {
                    wilayahMap[Wilayah] = {
                        key: `${index}`,
                        label: (
                            <div className="d-flex align-items-center flex-wrap flex-column">
                                <h5>{Wilayah}</h5>
                                <RangeCalendar
                                    wilayahKey={Wilayah} // Pass the Wilayah name as a key
                                    dates={dates[Wilayah] || null} // Initialize with stored dates
                                    onDateChange={(newDates) => {
                                        onDateChange(Wilayah, newDates),
                                            handleDateChange(Wilayah, newDates);
                                    }}
                                />
                            </div>
                        ),
                        children: [],
                    };
                }

                const branchKey = `${index}-${wilayahMap[Wilayah].children.length}`;

                wilayahMap[Wilayah].children.push({
                    key: branchKey,
                    label: BranchName,
                    code: BranchCode,
                });
            });

            const treeNodes = Object.values(wilayahMap);
            setNodes(treeNodes);
        } catch (error) {
            console.error("There was an error fetching the branches!", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBranches();
    }, []);

    return (
        <>
            <div className="card flex justify-content-center overflow-auto mt-4">
                <Tree
                    value={nodes}
                    selectionMode="checkbox"
                    selectionKeys={selectedKeys}
                    onSelectionChange={(e) => onSelectionChange(e.value)}
                    loading={loading}
                    className="tree-container"
                    filter
                    filterMode="lenient"
                    filterPlaceholder="Search By Company Name..."
                />
            </div>
        </>
    );
}
