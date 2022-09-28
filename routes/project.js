const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/verifyJWT");

// get the project with given id
router.get("/:projectId", authenticateToken, (req, res) => {
    try {
        const ownerId = req.user.id;
        const projectId = req.params.projectId;
        const findProject = "SELECT * FROM project WHERE id = ? AND ownerId = ?";
        db.query(findProject, [projectId, ownerId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            if (data.length === 0) {
                return res.status(409).json({ error: "The project does not belong to you" });
            }
            res.status(200).json({ project: data[0] });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// create a new project
router.post("/new", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const { name, description } = req.body;
        const findUser = "SELECT * FROM user WHERE id = ?";
        db.query(findUser, [id], (err, data) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: "Couldn't create the new project. Please try again!" });
            }
            const ownerId = data[0].id;
            const newProject = "INSERT INTO project (name, description, ownerId) VALUES (?)";
            const values = [name, description, ownerId];
            db.query(newProject, [values], (err, data) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: "Couldn't create the new project. Please try again!" });
                }
                res.status(201).json({
                    project: data,
                    success: "Successfully added a new project!",
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// update the project with given id
router.put("/:id", authenticateToken, (req, res) => {
    try {
        const ownerId = req.user.id;
        const projectId = req.params.id;
        const { name, description } = req.body;
        const findProject =
            "UPDATE project SET name = ?, description = ? WHERE id = ? AND ownerId = ?";
        db.query(findProject, [name, description, projectId, ownerId], (err, data) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: "Couldn't update project. Please try again!" });
            }
            res.status(200).json({ success: "Succesfully updated project" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// delete the project with given id
router.delete("/:id", authenticateToken, (req, res) => {
    try {
        const ownerId = req.user.id;
        const projectId = req.params.id;
        const deleteProject = "DELETE FROM project WHERE id = ? AND ownerId = ?";
        db.query(deleteProject, [projectId, ownerId], (err, data) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: "Couldn't delete project. Please try again!" });
            }
            res.status(200).json({ success: "Project deleted successfully" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// get recent projects
router.get("/recents/:limit", authenticateToken, (req, res) => {
    try {
        const limit = Number(req.params.limit);
        const id = req.user.id;
        const getProjects = "SELECT * FROM project WHERE ownerId = ? ORDER BY id DESC LIMIT ?";
        db.query(getProjects, [id, limit], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            res.status(200).json({ projects: data });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// get the count of total projects
router.get("/count/total", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const getProjectCount = "SELECT COUNT(*) AS cnt FROM project WHERE ownerId = ?";
        db.query(getProjectCount, [id], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            res.status(200).json({ count: data[0].cnt });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// get the projects based on current page no
router.get("/page/:pageNo/:limit", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const pageNo = Number(req.params.pageNo);
        const limit = Number(req.params.limit);
        const getProjects = "SELECT * FROM project WHERE ownerId = ? LIMIT ? OFFSET ?";
        db.query(getProjects, [id, limit, (pageNo - 1) * limit], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            res.status(200).json({ projects: data });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// get the count of projects with specific query
router.get("/query/count/:query", authenticateToken, (req, res) => {
    try {
        const ownerId = req.user.id;
        const query = req.params.query;
        const getQueryProjectsCount = `SELECT COUNT(*) AS cnt FROM project WHERE ownerId = ? AND name LIKE '%${query}%' `;
        db.query(getQueryProjectsCount, [ownerId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't fetch projects. Please refresh!" });
            }
            if (data.length === 0) {
                return res.status(404).json({ error: "No projects found" });
            }
            res.status(200).json({ count: data[0].cnt });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// get the projects with specific query
router.get("/query/:query/page/:pageNo/:limit", authenticateToken, (req, res) => {
    try {
        const ownerId = req.user.id;
        const query = req.params.query;
        const pageNo = Number(req.params.pageNo);
        const limit = Number(req.params.limit);
        const getQueryProjectsCount = `SELECT * FROM project WHERE ownerId = ? AND name LIKE '%${query}%' LIMIT ? OFFSET ?`;
        db.query(getQueryProjectsCount, [ownerId, limit, (pageNo - 1) * limit], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't fetch projects. Please refresh!" });
            }
            res.status(200).json({ projects: data });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
