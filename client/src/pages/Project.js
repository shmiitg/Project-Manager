import { useContext } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import Task from "../components/Task";
import "../assets/css/Project.css";
import { Redirect, useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const Project = () => {
    const history = useHistory();
    const closeUpdateModalButton = useRef(null);
    const { loggedUser, setLoggedUser } = useContext(UserContext);
    const [projectData, setProjectData] = useState({});
    const [tasksData, setTasksData] = useState([]);
    let { projectId } = useParams();
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [project, setProject] = useState({ name: "", description: "" });
    const [databaseQueried, setDataQueried] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);

    const handleInput = (e) => setProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    useEffect(() => {
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const fetchProject = async () => {
            const res = await fetch(`/api/project/${projectId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setProjectData(data.project);
                setProject({ name: data.project.name, description: data.project.description });
            } else {
                history.push("/dashboard");
                toast.error(data.error);
            }
        };

        const fetchTasks = async () => {
            const res = await fetch(`/api/task/${projectId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setTasksData(data.tasks);
                setIsDataLoading(false);
                setDataQueried(true);
            } else {
                toast.error(data.error);
            }
        };
        fetchProject();
        fetchTasks();
    }, []);

    const refreshTasks = async function () {
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch(`/api/task/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if (res.status === 200) {
            toast.success(data.success);
            closeUpdateModalButton.current.click();
            setTasksData(data.tasks);
        } else {
            toast.error(data.error);
        }
    };

    const updateProject = async () => {
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch(`/api/project/${projectId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(project),
        });
        const data = await res.json();
        if (res.status === 200) {
            toast.success(data.success);
            closeUpdateModalButton.current.click();
            setProjectData({ name: project.name, description: project.description });
        } else {
            toast.error(data.error);
        }
    };

    const deleteProject = async () => {
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch(`/api/project/${projectId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if (res.status === 200) {
            toast.success(data.success);
            closeUpdateModalButton.current.click();
            history.push("/dashboard");
        } else {
            toast.error(data.error);
        }
    };

    if (!loggedUser) return <Redirect to="/login" />;
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
                        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom ">
                            {isDataLoading && (
                                <Loader type="Puff" color="#005252" height={100} width={100} />
                            )}
                            <div className="row w-100">
                                <div className="col-10">
                                    <h1 className="h2 projTitle">
                                        Project:
                                        <strong className="projTitle">
                                            {" "}
                                            {projectData.name}
                                        </strong> - {projectData.description}
                                    </h1>
                                </div>
                                <div className="col-2">
                                    <button
                                        className="btn"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editProjectModal"
                                    >
                                        {/* update button */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                        </svg>
                                        <p>Edit Project</p>
                                    </button>
                                    <button className="btn" onClick={deleteProject}>
                                        {/* delete button */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            width="24"
                                        >
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                        </svg>
                                        <p>Delete Project</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-4">
                                <div className="me-3 shadow-lg border rounded-3 container taskContainer">
                                    <h2 className="mt-2">To-Do</h2>
                                    {showAddTaskForm ? (
                                        <TaskForm
                                            projectId={projectId}
                                            newTaskAdded={refreshTasks}
                                            closeTaskForm={() => {
                                                setShowAddTaskForm(false);
                                            }}
                                        />
                                    ) : (
                                        <button
                                            className="btn addBtn"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setShowAddTaskForm(true);
                                            }}
                                        >
                                            Add a new task
                                        </button>
                                    )}

                                    {isDataLoading && (
                                        <Loader
                                            type="Puff"
                                            color="#005252"
                                            height={100}
                                            width={100}
                                        />
                                    )}
                                    {tasksData.length ? (
                                        tasksData
                                            .filter((task) => {
                                                return task.state === "todo";
                                            })
                                            .map((task) => (
                                                <Task
                                                    key={task.id}
                                                    task={task}
                                                    taskUpdated={refreshTasks}
                                                />
                                            ))
                                    ) : databaseQueried ? (
                                        <h3 className="m-3">No tasks yet!</h3>
                                    ) : null}
                                </div>
                            </div>
                            <div className=" col-4">
                                <div className="me-3 shadow-lg border rounded-3 container taskContainer">
                                    <h2 className="mt-2"> In-Progress</h2>
                                    {isDataLoading && (
                                        <Loader
                                            type="Puff"
                                            color="#005252"
                                            height={100}
                                            width={100}
                                        />
                                    )}
                                    {tasksData
                                        .filter((task) => {
                                            return task.state === "inprogress";
                                        })
                                        .map((task) => (
                                            <Task
                                                key={task.id}
                                                task={task}
                                                taskUpdated={refreshTasks}
                                            />
                                        ))}
                                </div>
                            </div>
                            <div className=" col-4">
                                <div className="me-3 shadow-lg border rounded-3 container taskContainer">
                                    <h2 className="mt-2">Done</h2>
                                    {isDataLoading && (
                                        <Loader
                                            type="Puff"
                                            color="#005252"
                                            height={100}
                                            width={100}
                                        />
                                    )}
                                    {tasksData
                                        .filter((task) => {
                                            return task.state === "done";
                                        })
                                        .map((task) => (
                                            <Task
                                                key={task.id}
                                                task={task}
                                                taskUpdated={refreshTasks}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <div
                    className="modal fade"
                    id="editProjectModal"
                    tabIndex="-1"
                    aria-labelledby="editProjectModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title" id="editProjectModalLabel">
                                    Edit Project
                                </h3>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="project-name" className="col-form-label">
                                            Project Name:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="project-name"
                                            name="name"
                                            value={project.name}
                                            onChange={handleInput}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="description-text"
                                            className="col-form-label"
                                        >
                                            Description:
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description-text"
                                            name="description"
                                            value={project.description}
                                            onChange={handleInput}
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btnClose"
                                    data-bs-dismiss="modal"
                                    id="closeUpdateModalButton"
                                    ref={closeUpdateModalButton}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btnUpdate"
                                    onClick={updateProject}
                                >
                                    Edit project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Project;
