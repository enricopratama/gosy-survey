import React from "react";
export default function BreadcrumbComponent(props) {
    return (
        <>
            <nav aria-label="breadcrumb" className="ml-auto">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a href="/home">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                        <a href="#">Configs</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {props.pageName}
                    </li>
                </ol>
            </nav>
        </>
    );
}
