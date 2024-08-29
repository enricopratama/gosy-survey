import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import { Calendar } from "primereact/calendar";
import axios from "axios";
import "../../css/DSOSelection.css";
import RangeDemo from "./RangeDemo";

// Utility function to check if the device is mobile based on breakpoints
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
};

export default function DSOSelection() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState({});
    const [dates, setDates] = useState({}); // Store start and end dates for each Wilayah

    const isMobile = useIsMobile(); // Get the current breakpoint

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
                                <RangeDemo />
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

    const onSelectionChange = (e) => {
        setSelectedKeys(e.value);
    };

    console.log("Selected keys", selectedKeys);
    console.log("Dates State:", dates);

    return (
        <>
            <div className="card flex justify-content-center overflow-auto mt-4">
                <Tree
                    value={nodes}
                    selectionMode="checkbox"
                    selectionKeys={selectedKeys}
                    onSelectionChange={onSelectionChange}
                    loading={loading}
                    className="tree-container"
                    filter
                    filterMode="lenient"
                    filterPlaceholder="Search By DSO Name..."
                />
            </div>
        </>
    );
}
