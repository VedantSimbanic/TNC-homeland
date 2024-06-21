import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
}

const AgentSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: false, validate: /^\d{10}$/ },
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAgent>("Agent", AgentSchema);
