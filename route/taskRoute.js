const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");

router.post("/tasks", taskController.addTask);
router.get("/tasks/:id", taskController.getTask);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.put("/tasks/:id/complete", taskController.markTaskAsComplete);
router.get("/tasks/t/summary", taskController.generateTaskSummary);

module.exports = router;
