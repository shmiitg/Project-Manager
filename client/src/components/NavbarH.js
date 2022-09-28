import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LogoImage from "../assets/images/TinyLogo.png";
import { UserContext } from "../context/UserContext";

const NavbarH = () => {
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    const handleSignOut = async () => {
        localStorage.removeItem("TaskUpToken");
        setLoggedUser(null);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container">
                <img src={LogoImage} alt="TaskUp Logo" style={{ width: "70px" }} />
                <h3 className="navbar-nav linkText mb-0" href="/">
                    TaskUp
                </h3>
                <button
                    className="navbar-toggler button-color"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        {loggedUser ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        onClick={handleSignOut}
                                        className="nav-link mb-0 border-0 bg-transparent"
                                    >
                                        Sign Out
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" aria-current="page" to="/login">
                                        Log In
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarH;
