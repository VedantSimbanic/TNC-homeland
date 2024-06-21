//@ts-nocheck
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AgentModel from "../../models/agent";


export const loginAgent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const agent = await AgentModel.findOne({ email });
  
      if (!agent) {
        res.status(401).json({ status: false, message: "Agent not found" });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, agent.password);
  
      if (!isMatch) {
        res.status(401).json({ status: false, message: "Invalid credentials" });
        return;
      }
  
      const token = jwt.sign(
        { id: agent._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );
  
      res.cookie("jwt", token, { httpOnly: true, secure: true });
      console.log(token);
      return res
        .status(200)
        .json({ status: true, message: "Logged in successfully", token });
    } catch (error) {
      res.status(500).json({ status: true, message: "Internal server error" });
    }
  };