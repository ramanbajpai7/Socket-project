const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;
const taskRoutes = require("./route/taskRoute");

app.use(express.json());

app.use("/api", taskRoutes);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

mongoose;
mongoose
  .connect(
    "mongodb+srv://ramanbajpai9795:OQLgRHML6IBYB62x@cluster0.n5t3z.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });

const taskUpdated = (updatedTask) => {
  broadcast({
    event: "taskUpdated",
    data: updatedTask,
  });
};

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updatedTask = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, updatedTask, { new: true });

    if (task) {
      taskUpdated(task);
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});
