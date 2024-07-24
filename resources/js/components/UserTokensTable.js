import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DataTable, Column } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import ButtonComponent from "./ButtonComponent";

export default function UserTokensTable() {
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
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const toast = useRef(null);

    const getUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/master-tokens");
            setCustomers(response.data);
        } catch (error) {
            console.error(
                "There was an error fetching the user tokens!",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value || ""; // Use empty string instead of null
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { ...prevFilters.global, value },
        }));
        setGlobalFilterValue(value);
    };

    const onUserIdFilterChange = (e) => {
        const value = e.target.value || ""; // Use empty string instead of null
        setFilters((prevFilters) => ({
            ...prevFilters,
            user_id: { ...prevFilters.user_id, value },
        }));
        setUserIdFilterValue(value);
    };

    const onRowSelect = (event) => {
        toast.current.show({
            severity: "info",
            summary: "User Selected",
            detail: `User ID: ${event.data.user_id}`,
            life: 3000,
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: "warn",
            summary: "User Unselected",
            detail: `User ID: ${event.data.user_id}`,
            life: 3000,
        });
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <ButtonComponent label="Add" icon="pi pi-plus" iconPos="left" />
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

    const exportCSV = () => {
        const csvData = customers.map((row) => ({
            user_id: row.user_id,
            user_login: row.user_login,
            account_name: row.account_name,
            company_code: row.company_code,
        }));
        const csvContent = [
            ["User ID", "Access Login", "Account Name", "Company Code"],
            ...csvData.map((item) => [
                item.user_id,
                item.user_login,
                item.account_name,
                item.company_code,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, "users.csv");
    };

    const paginatorLeft = (
        <Button type="button" icon="pi pi-refresh" text onClick={getUsers} />
    );
    const paginatorRight = (
        <Button type="button" icon="pi pi-download" text onClick={exportCSV} />
    );

    return (
        <div className="card border-1 surface-border border-round">
            <Toast ref={toast} />
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
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    paginatorLeft={paginatorLeft}
                    paginatorRight={paginatorRight}
                    selectionMode="single"
                    selection={selectedCustomer}
                    onSelectionChange={(e) => setSelectedCustomer(e.value)}
                    onRowSelect={onRowSelect}
                    onRowUnselect={onRowUnselect}
                    removableSort
                >
                    <Column
                        header="No."
                        headerStyle={{ width: "3rem" }}
                        body={(data, options) => options.rowIndex + 1}
                    />
                    <Column
                        field="user_id"
                        header="User ID"
                        filter
                        filterPlaceholder="Search by user ID"
                        style={{ minWidth: "12rem" }}
                        sortable
                    />
                    <Column
                        field="user_login"
                        header="Access Login"
                        filter
                        filterPlaceholder="Search by user login"
                        style={{ minWidth: "12rem" }}
                        sortable
                    />
                    <Column
                        field="salesman_code"
                        header="Salesman Code"
                        style={{ minWidth: "12rem" }}
                        filter
                        sortable
                        filterPlaceholder="Search by account name"
                    />
                    <Column
                        field="account_name"
                        header="Account Name"
                        style={{ minWidth: "12rem" }}
                        filter
                        sortable
                        filterPlaceholder="Search by account name"
                    />
                    <Column
                        field="otp_value"
                        header="Token Access"
                        style={{ minWidth: "12rem" }}
                        filter
                        sortable
                        filterPlaceholder="Search by account name"
                    />
                    <Column
                        field="company_code"
                        header="Company Code"
                        filterField="company_code"
                        style={{ minWidth: "12rem" }}
                        filter
                        sortable
                        filterPlaceholder="Search by company code"
                    />
                </DataTable>
            )}
        </div>
    );
}
