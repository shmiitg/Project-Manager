import { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import "../assets/css/Auth.css";
import LogoImage from "../assets/images/TaskUp.png";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const Login = () => {
    const history = useHistory();
    const { setLoggedUser } = useContext(UserContext);
    const [user, setUser] = useState({ email: "", password: "" });
    const handleInput = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            const data = await res.json();
            if (res.status === 200) {
                localStorage.setItem("TaskUpToken", data.accessToken);
                toast.success(data.success);
                setLoggedUser(data.id);
                history.push("/");
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };
    return (
        <div className="form-container">
            <main className="form-signin text-center">
                <Link to="/">
                    <img src={LogoImage} alt="TaskUp Logo" width="200" />
                    <div className="row justify-content-center mb-4">
                        <div>About TaskUp</div>
                    </div>
                </Link>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="email">Email address</label>
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
                        Log In
                    </button>

                    <Link className="signup-link" to="/register">
                        Don't have an account? Sign up for TaskUp!
                    </Link>
                </form>
            </main>
        </div>
    );
};

export default Login;
