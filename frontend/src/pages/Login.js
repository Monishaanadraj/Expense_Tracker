import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Auth.module.css"; 

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", { email, password });

            console.log("Response:", response.data);

            const userData = response.data.user; 
            localStorage.setItem("user", JSON.stringify(userData)); //  Store in localStorage
            setUser(userData); 

            alert("Login successful!");
            navigate("/"); 
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Login failed");
        }
    };


    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleSubmit} className={styles.authForm}>
                <h2>Login</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </form>
        </div>
    );
};

export default Login;
