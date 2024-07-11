import React, { useEffect } from "react";

export default function SidebarComponent() {
    useEffect(() => {
        // Define the sidebar open and close functions
        function w3_open() {
            document.getElementById("main").style.marginLeft = "25%";
            document.getElementById("mySidebar").style.width = "25%";
            document.getElementById("mySidebar").style.display = "block";
            document.getElementById("openNav").style.display = "none";
        }

        function w3_close() {
            document.getElementById("main").style.marginLeft = "0%";
            document.getElementById("mySidebar").style.display = "none";
            document.getElementById("openNav").style.display = "inline-block";
        }

        // Attach the functions to the window object to make them accessible in the HTML
        window.w3_open = w3_open;
        window.w3_close = w3_close;
    }, []);

    return (
        <div>
            <link
                rel="stylesheet"
                href="https://www.w3schools.com/w3css/4/w3.css"
            />
            <div
                className="w3-sidebar w3-bar-block w3-card w3-animate-left"
                style={{ display: "none" }}
                id="mySidebar"
            >
                <button
                    className="w3-bar-item w3-button w3-large"
                    onClick={() => window.w3_close()}
                >
                    Close &times;
                </button>
                <a href="#" className="w3-bar-item w3-button">
                    Link 1
                </a>
                <a href="#" className="w3-bar-item w3-button">
                    Link 2
                </a>
                <a href="#" className="w3-bar-item w3-button">
                    Link 3
                </a>
            </div>

            <div id="main">
                <div className="w3-teal">
                    <button
                        id="openNav"
                        className="w3-button w3-teal w3-xlarge"
                        onClick={() => window.w3_open()}
                    >
                        &#9776;
                    </button>
                    <div className="w3-container">
                        <h1>My Page</h1>
                    </div>
                </div>

                <img
                    src="https://www.w3schools.com/w3images/img_car.jpg"
                    alt="Car"
                    style={{ width: "100%" }}
                />

                <div className="w3-container">
                    <p>
                        In this example, the sidebar is hidden
                        (style="display:none")
                    </p>
                    <p>
                        It is shown when you click on the menu icon in the top
                        left corner.
                    </p>
                    <p>
                        When it is opened, it shifts the page content to the
                        right.
                    </p>
                    <p>
                        We use JavaScript to add a 25% left margin to the div
                        element with id="main" when this happens. The value
                        "25%" matches the width of the sidebar.
                    </p>
                </div>
            </div>
        </div>
    );
}
