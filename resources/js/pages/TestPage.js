import React, { useState } from "react";

function TestPage() {
    const [username, setUsername] = useState("PredefinedUser");
    const [email, setEmail] = useState("example@example.com");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log("Username:", username);
        console.log("Email:", email);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <br />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default TestPage;
