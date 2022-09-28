import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { Redirect, Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import IconImage from "../assets/images/userIcon.png";
import { UserContext } from "../context/UserContext";
import Footer from "../components/Footer.js";

function UpdateProfile(props) {
    const { setLoggedUser } = useContext(UserContext);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [user, setUser] = useState({ name: "", email: "", institute: "" });
    const handleInput = (e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    useEffect(() => {
        const fetchUserData = async () => {
            const accessToken = localStorage.getItem("TaskUpToken");
            if (!accessToken) {
                setLoggedUser(null);
                return;
            }
            const res = await fetch(`/api/user/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setUser(data.user);
                setIsDataLoading(false);
            } else {
                toast.error(data.error);
            }
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch("/api/user/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(user),
        });
        const data = await res.json();
        if (res.status === 200) {
            toast.success(data.success);
        } else {
            toast.error(data.error);
        }
    };

    return (
        <div className="profile-cont">
            <Navbar />
            <nav
                id="sidebarMenu"
                className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            >
                <div className="position-sticky pt-3">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/dashboard">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-home"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/profile">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-users"
                                >
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                Profile
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <form onSubmit={handleSubmit} className="profile-container">
                    <h1 className="mt-3">Profile:</h1>
                    <div className="main-body">
                        {isDataLoading && (
                            <Loader type="Puff" color="#005252" height={500} width={500} />
                        )}
                        {!isDataLoading && (
                            <div className="row gutters-sm">
                                <div className="col-md-4 mb-3">
                                    <div className="profile-card">
                                        <div className="p-card-body">
                                            <div className="d-flex flex-column align-items-center text-center">
                                                <img
                                                    src={IconImage}
                                                    alt="Admin"
                                                    className="rounded-circle"
                                                    width="120"
                                                />
                                                <h2 className="card-title mb-0">{user.name}</h2>
                                                <div className="mt-3">
                                                    <button className="btn saveBtn">
                                                        Save Profile
                                                    </button>
                                                </div>
                                                <div className="mt-1">
                                                    <Link className="btn btnCancel" to="/profile">
                                                        Cancel Update
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="profile-card mb-3">
                                        <div className="p-card-body">
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <label className="mb-0" htmlFor="nameEditInput">
                                                        Name
                                                    </label>
                                                </div>
                                                <input
                                                    id="nameEditInput"
                                                    className="col-sm-9 text-secondary"
                                                    value={user.name}
                                                    type="text"
                                                    name="name"
                                                    onChange={handleInput}
                                                    required
                                                />
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <label
                                                        htmlFor="institutionEditInput"
                                                        className="mb-0"
                                                    >
                                                        Institution
                                                    </label>
                                                </div>
                                                <input
                                                    id="institutionEditInput"
                                                    className="col-sm-9 text-secondary"
                                                    value={user.institute}
                                                    type="text"
                                                    name="institute"
                                                    onChange={handleInput}
                                                    required
                                                />
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <label
                                                        htmlFor="emailEditInput"
                                                        className="mb-0"
                                                    >
                                                        Email
                                                    </label>
                                                </div>
                                                <input
                                                    id="emailEditInput"
                                                    className="col-sm-9 text-secondary"
                                                    value={user.email}
                                                    type="email"
                                                    name="email"
                                                    onChange={handleInput}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                            <path
                                fill="#005252"
                                fillOpacity="1"
                                d="M0,0L48,5.3C96,11,192,21,288,69.3C384,117,480,203,576,208C672,213,768,139,864,133.3C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ></path>
                        </svg>
                    </div>
                </form>
                <Footer />
            </main>
        </div>
    );
}

export default UpdateProfile;
