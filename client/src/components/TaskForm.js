import { useState, useContext } from "react";
import { toast } from "react-toastify";
import "../assets/css/TaskForm.css";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.minimal.css";
import { UserContext } from "../context/UserContext";

const TaskForm = (props) => {
    const { setLoggedUser } = useContext(UserContext);

    const [taskName, setTaskName] = useState("");
    const handleChange = (e) => setTaskName(e.target.value);

    const createTask = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("TaskUpToken");
        if (!accessToken) {
            setLoggedUser(null);
            return;
        }
        const res = await fetch("/api/task/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                projectId: props.projectId,
                name: taskName,
                state: "todo",
            }),
        });
        const data = await res.json();
        if (res.status === 201) {
            setTaskName("");
            props.newTaskAdded();
            toast.success(data.success);
        } else {
            toast.error(data.error);
        }
    };

    return (
        <div className="card p-3 border mt-3 shadow">
            <form onSubmit={createTask}>
                <div className="mb-3">
                    <label htmlFor="task" className="form-label">
                        New Task
                    </label>
                    <textarea
                        className="form-control"
                        id="task"
                        name="task"
                        rows="3"
                        value={taskName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="btn addBtn me-2" type="submit">
                    Add task
                </button>
                <button
                    className="btn btnClose"
                    onClick={(event) => {
                        event.preventDefault();
                        props.closeTaskForm();
                    }}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

TaskForm.propTypes = {
    newTaskAdded: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
    closeTaskForm: PropTypes.func.isRequired,
};

export default TaskForm;
