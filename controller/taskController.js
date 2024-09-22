const Task = require("../modals/taskModels");
const nodemailer = require("nodemailer");
exports.addTask = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    const newTask = new Task({ title, description, priority, status });
    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task", error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
exports.markTaskAsComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "Completed";
    await task.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Task Completed",
      text: `Your task "${task.title}" has been marked as completed.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Task completed but error sending email", error });
      }
      console.log("Email sent: " + info.response);
      return res
        .status(200)
        .json({ message: "Task marked as completed and email sent", task });
    });
  } catch (error) {
    res.status(500).json({ message: "Error marking task as completed", error });
  }
};
exports.generateTaskSummary = async (req, res) => {
  try {
    const tasks = await Task.find({});

    let summary = {
      pendingCount: 0,
      completedCount: 0,
    };
    console.log(tasks);

    tasks.forEach((task) => {
      if (task.status === "Pending") {
        summary.pendingCount++;
      } else if (task.status === "Completed") {
        summary.completedCount++;
      }
    });

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating task summary:", error);
    res.status(500).json({ message: "Error generating task summary", error });
  }
};
