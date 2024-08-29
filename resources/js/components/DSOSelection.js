import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import axios from "axios";
import "../../css/DSOSelection.css";

export default function DSOSelection() {
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState({}); // Initialize as an object

    const getBranches = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/branches");
            const branches = response.data;

            // Transform the branches data into the format required by the Tree component
            const wilayahMap = {};

            branches.forEach((branch, index) => {
                const { Wilayah, BranchName, BranchCode } = branch;

                // Unique Wilayah
                if (!wilayahMap[Wilayah]) {
                    wilayahMap[Wilayah] = {
                        key: `${index}`,
                        label: Wilayah,
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
                    filterMode="strict"
                    filterPlaceholder="Search By DSO Name..."
                />
            </div>
        </>
    );
}
