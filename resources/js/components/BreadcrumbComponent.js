import React from "react";
export default function BreadcrumbComponent() {
    return (
        <>
            <nav aria-label="breadcrumb" className="ml-auto">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="#">Library</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Data
                    </li>
                </ol>
            </nav>
        </>
    );
}
