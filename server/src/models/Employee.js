import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true } // corresponds to position
}, { timestamps: true });

export default mongoose.model("Employee", EmployeeSchema);
