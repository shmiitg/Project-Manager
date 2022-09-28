import { useState, useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import NavLogo from "../assets/images/NavLogo.png";
import { UserContext } from "../context/UserContext";

function NavbarWSearch() {
    const { loggedUser, setLoggedUser } = useContext(UserContext);

    const handleSignOut = async () => {
        localStorage.removeItem("TaskUpToken");
        setLoggedUser(null);
    };

    const [searchSubmitted, setSearchSubmitted] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleSearchSubmit = (e) => {
        setSearchSubmitted(true);
        e.preventDefault();
    };

    const handleSearchFormChange = (e) => {
        setSearchValue(e.target.value);
    };

    if (loggedUser && !searchSubmitted) {
        return (
            <header className="navbar navbar-light sticky-top nav-bg flex-md-nowrap p-0 shadow">
                <Link className="col-md-3 col-lg-2 me-0 px-3 optask-brand-text" to="/">
                    <img
                        src={NavLogo}
                        alt="TaskUp Logo"
                        className="me-1"
                        style={{ width: "35px", height: "35px" }}
                    />
                    TaskUp
                </Link>
                <button
                    className="navbar-toggler position-absolute d-md-none collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebarMenu"
                    aria-controls="sidebarMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <form
                    className="w-100 ms-4 me-4"
                    id="navbarSearchForm"
                    onSubmit={handleSearchSubmit}
                    value={searchValue}
                    onChange={handleSearchFormChange}
                >
                    <input
                        className="form-control w-100 rounded"
                        type="text"
                        placeholder="Search for a project"
                        aria-label="Project search bar"
                        required
                    />
                </form>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <button className="btn nav-bar-sign-out mb-0" onClick={handleSignOut}>
                            Sign out
                        </button>
                    </li>
                </ul>
            </header>
        );
    } else if (loggedUser && searchSubmitted) {
        return <Redirect push to={"/search/" + searchValue} />;
    } else {
        return <Redirect to={"/login"} />;
    }
}

export default NavbarWSearch;
