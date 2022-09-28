import { useContext } from "react";
import NavbarWSearch from "../components/NavbarWSearch";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { toast } from "react-toastify";
import Footer from "../components/Footer.js";
import { UserContext } from "../context/UserContext";
import "../assets/css/Dashboard.css";

//intialize the material ui styles with their hook
const useStyles = makeStyles((theme) => ({
    root: {
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

const Dashboard = () => {
    const { setLoggedUser } = useContext(UserContext);
    let newProjectForm = useRef(null);
    let closeModalButton = useRef(null);
    const [userProjects, setProjectsData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [projectCount, setProjectCount] = useState(0);
    const [sideBarProjects, setSideBarProjects] = useState([]);
    const [databaseQueried, setDataQueried] = useState(false);

    // pagination handling
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const handlePaginationChange = (event, value) => {
        if (page === value) {
            return;
        }
        setProjectsData([]);
        setIsDataLoading(true);
        setPage(value);
    };

    // get the user's project count to implement pagination
    const getProjectsCount = async () => {
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch(`/api/project/count/total`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        setProjectCount(data.count);
        setIsDataLoading(false);
    };

    // show the most recent projects for the user
    const getRecentProjects = async () => {
        const limit = 5;
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch(`/api/project/recents/${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if (res.status === 200) {
            setSideBarProjects(data.projects);
        } else {
            toast.error(data.error);
        }
    };

    // handle the submission of a new project
    const newProjectSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const formData = new FormData(newProjectForm.current);
        const name = formData.get("projectName");
        const description = formData.get("projectDescription");

        const res = await fetch(`/api/project/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: name,
                description: description,
            }),
        });
        const data = await res.json();
        if (res.status === 201) {
            closeModalButton.current.click();
            toast.success(data.success);
            const limit = 5;
            const dataResult = await fetch(`/api/project/page/${page}/${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const parsedProjectsData = await dataResult.json();
            setProjectsData(parsedProjectsData.projects);
            getProjectsCount();
            getRecentProjects();
        } else {
            toast.error(data.error);
        }
    };

    // get projects based on the selected page
    useEffect(() => {
        const fetchProjectData = async () => {
            const accessToken = localStorage.getItem("TaskUpToken");
            if (!accessToken) {
                setLoggedUser(null);
                return;
            }
            //get limit projects per page
            const limit = 5;
            const res = await fetch(`/api/project/page/${page}/${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setProjectsData(data.projects);
                setDataQueried(true);
            } else {
                toast.error(data.error);
            }
            setIsDataLoading(false);
        };
        fetchProjectData();
    }, [page]);

    useEffect(() => {
        getProjectsCount();
        getRecentProjects();
    }, []);

    return (
        <div>
            <NavbarWSearch />
            <div className="container-fluid">
                <div className="row">
                    <nav
                        id="sidebarMenu"
                        className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
                    >
                        <div className="position-sticky pt-3">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <Link
                                        className="nav-link active"
                                        aria-current="page"
                                        to="/dashboard"
                                    >
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
                                    <Link className="nav-link" to="/profile">
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
                                <li className="nav-item">
                                    <button
                                        className="btn nav-link"
                                        data-bs-toggle="modal"
                                        data-bs-target="#newProjectModal"
                                        data-bs-whatever="@mdo"
                                    >
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
                                            className="feather feather-plus-circle"
                                        >
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="16"></line>
                                            <line x1="8" y1="12" x2="16" y2="12"></line>
                                        </svg>
                                        Create a new project
                                    </button>
                                </li>
                            </ul>
                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1">
                                <span>Recent Projects</span>
                            </h6>
                            <ul className="nav flex-column mb-2">
                                {!isDataLoading &&
                                    sideBarProjects.map((project) => (
                                        <li key={project.id}>
                                            <Link
                                                key={project.id}
                                                className="projectLink nav-link"
                                                to={"/projects/" + project.id}
                                            >
                                                {project.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                            {!isDataLoading && sideBarProjects.length === 0 && (
                                <div className="container">No Projects Yet!</div>
                            )}
                        </div>
                    </nav>
                    <div
                        className="modal fade"
                        id="newProjectModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        New Project
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form
                                        id="newProjectForm"
                                        ref={newProjectForm}
                                        onSubmit={newProjectSubmit}
                                    >
                                        <div className="mb-3">
                                            <label htmlFor="projectName" className="col-form-label">
                                                Project Name:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="projectName"
                                                name="projectName"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor="projectDescription"
                                                className="col-form-label"
                                            >
                                                Project Description:
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="projectDescription"
                                                name="projectDescription"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btnClose"
                                                data-bs-dismiss="modal"
                                                id="closeModalButton"
                                                ref={closeModalButton}
                                            >
                                                Close
                                            </button>
                                            <button type="submit" className="btn createBtn">
                                                Create Project
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2 dashTitle">Dashboard</h1>
                        </div>
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {isDataLoading && (
                                <div className="container">
                                    <Loader type="Puff" color="#005252" height={500} width={500} />
                                </div>
                            )}
                            {userProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    className="projectLink"
                                    to={"/projects/" + project.id}
                                >
                                    <ProjectCard
                                        key={project.id}
                                        name={project.name}
                                        description={project.description}
                                    />
                                </Link>
                            ))}

                            {!isDataLoading && databaseQueried && userProjects.length === 0 && (
                                <div>
                                    <h3>No Projects Yet!</h3>
                                </div>
                            )}
                        </div>
                        {userProjects.length ? (
                            <div className="d-flex justify-content-center mt-3">
                                <div className={classes.root}>
                                    <Typography align="center">Page: {page}</Typography>
                                    <Pagination
                                        count={Math.ceil(projectCount / 5)}
                                        page={page}
                                        onChange={handlePaginationChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <Footer />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
