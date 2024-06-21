//@ts-nocheck
import { Request, Response } from "express";


export const LogoutAgent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      res.clearCookie("jwt");
      return res.status(200).json({ status: true, message: "Logout successful" });
    } catch (error) {
      console.error("Error logging out agent:", error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  };