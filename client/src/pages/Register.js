import { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import LogoImage from "../assets/images/TaskUp.png";
import { toast } from "react-toastify";

const Register = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "", institute: "" });
    const handleInput = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const [registerStatus, setRegisterStatus] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            const data = await res.json();
            if (res.status === 201) {
                toast.success("Successfully created account.");
                setRegisterStatus(true);
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            window.alert("Something went wrong");
        }
    };

    if (registerStatus) {
        return <Redirect to="/login" />;
    }
    return (
        <div className="form-container">
            <main className="form-signin text-center">
                <Link to="/">
                    <img src={LogoImage} alt="TaskUp Logo" width="200" />
                    <div className="row justify-content-center mb-4">
                        <div>About TaskUp</div>
                    </div>
                </Link>
                <h1 className="h3 mb-3 fw-normal">Sign up for TaskUp!</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-floating">
                        <input
                            type="name"
                            className="form-control"
                            placeholder="Full Name"
                            name="name"
                            id="name"
                            value={user.name}
                            onChange={handleInput}
                            required
                        />
                        <label htmlFor="name">Full Name</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="institution"
                            className="form-control"
                            placeholder="Institution/Company"
                            name="institute"
                            id="institute"
                            value={user.institute}
                            onChange={handleInput}
                            required
                        />
                        <label htmlFor="institute">Institution/Company</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
                            name="email"
                            id="email"
                            value={user.email}
                            onChange={handleInput}
                            required
                        />
                        <label htmlFor="userEmail">Email Address</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handleInput}
                            required
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <button type="submit" className="w-100 btn btn-lg submitBtn">
                        Sign Up
                    </button>

                    <Link className="signup-link" to="/login">
                        Already have an account? Sign in here!
                    </Link>
                </form>
            </main>
        </div>
    );
};

export default Register;
