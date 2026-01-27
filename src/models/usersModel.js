import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    data: { type: Date, default: Date.now }
});

export default mongoose.model("Usuario", userScheme);