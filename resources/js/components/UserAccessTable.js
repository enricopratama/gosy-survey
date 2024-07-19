import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable, Column } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Button } from "primereact/button";

export default function UserAccessTable() {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        user_id: { value: null, matchMode: FilterMatchMode.EQUALS },
        user_login: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        account_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        company_code: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [userIdFilterValue, setUserIdFilterValue] = useState("");
    const getUsers = async () => {
        await axios
            .get("/master-users")
            .then((response) => {
                setCustomers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the users!", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || ""; // Use empty string instead of null
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onUserIdFilterChange = (e) => {
        const value = e.target.value || ""; // Use empty string instead of null
        let _filters = { ...filters };
        _filters["user_id"].value = value;
        setFilters(_filters);
        setUserIdFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between align-items-center">
                <Button label="Submit" />
                <IconField iconPosition="left" className="ml-3">
                    <InputIcon className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search..."
                    />
                </IconField>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card border-1 surface-border border-round">
            {loading ? (
                <div>
                    <Skeleton width="100%" height="4rem" />
                    <Skeleton width="100%" height="4rem" />
                    <Skeleton width="100%" height="4rem" />
                    <Skeleton width="100%" height="4rem" />
                </div>
            ) : (
                <DataTable
                    value={customers}
                    rows={5}
                    paginator
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    dataKey="user_id"
                    stripedRows
                    filters={filters}
                    filterDisplay="row"
                    loading={loading}
                    globalFilterFields={[
                        "user_id",
                        "user_login",
                        "account_name",
                        "company_code",
                    ]}
                    header={header}
                    emptyMessage="No users found."
                    className="border-1 surface-border border-round"
                >
                    <Column
                        field="user_id"
                        header="User ID"
                        filter
                        filterPlaceholder="Search by user ID"
                        style={{ minWidth: "12rem" }}
                        sortable
                    ></Column>
                    <Column
                        field="user_login"
                        header="User Login"
                        filter
                        filterPlaceholder="Search by user login"
                        style={{ minWidth: "12rem" }}
                        sortable
                    ></Column>
                    <Column
                        field="account_name"
                        header="Account Name"
                        filterField="account_name"
                        style={{ minWidth: "12rem" }}
                        filter
                        sortable
                        filterPlaceholder="Search by account name"
                    ></Column>
                    <Column
                        field="company_code"
                        header="Company Code"
                        filterField="company_code"
                        style={{ minWidth: "12rem" }}
                        filter
                        sortable
                        filterPlaceholder="Search by company code"
                    ></Column>
                </DataTable>
            )}
        </div>
    );
}
