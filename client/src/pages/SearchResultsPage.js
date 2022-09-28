import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { Link, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Footer from "../components/Footer.js";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

function SearchResultsPage(props) {
    const { setLoggedUser } = useContext(UserContext);
    const [userProjects, setProjectsData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [projectCount, setProjectCount] = useState(0);
    const { query } = useParams();
    const [databaseQueried, setDataQueried] = useState(false);

    // pagination handling
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const handlePaginationChange = (event, value) => {
        setProjectsData([]);
        setIsDataLoading(true);
        setPage(value);
    };

    useEffect(() => {
        // get the user's project count to implement pagination
        const fetchProjectCount = async () => {
            const accessToken = localStorage.getItem("TaskUpToken");
            if (!accessToken) {
                setLoggedUser(null);
                return;
            }
            const res = await fetch(`/api/project/query/count/${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setProjectCount(data.count);
            } else {
                toast.error(data.error);
            }
            setIsDataLoading(false);
        };
        fetchProjectCount();
    }, [query]);

    // get projects based on the page that was selected
    useEffect(() => {
        const fetchProjectData = async () => {
            const accessToken = localStorage.getItem("TaskUpToken");
            if (!accessToken) {
                setLoggedUser(null);
                return;
            }
            const limit = 5;
            const res = await fetch(`/api/project/query/${query}/page/${page}/${limit}`, {
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
    }, [page, query]);

    return (
        <div>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
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
                            </ul>
                        </div>
                    </nav>

                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                            <h1 className="h2">Search Results: {query}</h1>
                        </div>
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {isDataLoading && (
                                <Loader type="Puff" color="#005252" height={500} width={500} />
                            )}
                            {userProjects.map((project) => {
                                return (
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
                                );
                            })}
                            {(databaseQueried && userProjects.length) === 0 && (
                                <h3> OOPS! No projects found</h3>
                            )}
                        </div>
                        {userProjects.length ? (
                            <div className="d-flex justify-content-center mt-2">
                                <div className={classes.root}>
                                    <Typography>Page: {page}</Typography>
                                    <Pagination
                                        count={Math.floor(projectCount / 5) + 1}
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
}

export default SearchResultsPage;
