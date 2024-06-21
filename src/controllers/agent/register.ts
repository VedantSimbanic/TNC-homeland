import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AgentModel from "../../models/agent";
import { validatePassword } from "../../helpers/passwordValidator";

// Register agent
export const registerAgent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    let agent = await AgentModel.findOne({ email });
    if (agent) {
      res
        .status(400)
        .json({ status: false, message: "Agent already registered" });
      return;
    }

    if (password !== confirmPassword) {
      res
        .status(400)
        .json({ status: false, message: "Passwords do not match" });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({
        status: false,
        message:
          "Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one symbol (@, #, !, %, ^)",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    agent = new AgentModel({
      fullName,
      email,
      password: hashedPassword,
    });

    await agent.save();
    res
      .status(201)
      .json({ status: true, message: "Agent registered successfully" });
  } catch (error) {
    console.error("Error registering agent:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
