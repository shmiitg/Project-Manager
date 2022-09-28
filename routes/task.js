const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/verifyJWT");

// get all tasks with given projectId
router.get("/:projectId", authenticateToken, (req, res) => {
    try {
        const projectId = req.params.projectId;
        const getTasks = `SELECT project.id AS projectId, task.id AS id, task.name AS name, state
        FROM project LEFT JOIN task ON project.id = task.projectId WHERE project.id = ? `;
        db.query(getTasks, [projectId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong. Please try again!" });
            }
            res.status(200).json({ tasks: data });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// add a new task
router.post("/new", authenticateToken, (req, res) => {
    try {
        const { projectId, name, state } = req.body;
        const newTask = "INSERT INTO task (projectId, name, state) VALUES (?)";
        const values = [projectId, name, state];
        db.query(newTask, [values], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't add task. Please try again!" });
            }
            res.status(201).json({ success: "Successfully added in a new task!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// delete a task with given id
router.delete("/:taskId", authenticateToken, (req, res) => {
    try {
        const taskId = req.params.taskId;
        const deleteTask = "DELETE FROM task WHERE id = ?";
        db.query(deleteTask, [taskId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't delete task. Please try again" });
            }
            res.status(200).json({ success: "Successfully deleted task!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

router.put("/:taskId", authenticateToken, (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { name, state } = req.body;
        const updateTask = "UPDATE task SET name = ?, state = ? WHERE id = ?";
        db.query(updateTask, [name, state, taskId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't update task. Please try again" });
            }
            res.status(200).json({ success: "Successfully updated task!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

module.exports = router;
