const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["todo","in_progress", "done"],
    default: "todo"
  }
}, {
  timestamps: true
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;