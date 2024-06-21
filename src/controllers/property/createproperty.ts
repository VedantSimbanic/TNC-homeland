import { Request, Response } from "express";
import Property, { IProperty } from "../../models/property";
import { validateProperty } from "../../helpers/validation/propertyvalidation";
import path from "path";
import fs from "fs";
import Agent from "../../models/agent";

const propertiesDirPath = path.join(__dirname, "../../data");
const propertiesFilePath = path.join(propertiesDirPath, "properties.json");

const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = files?.map((file) => file.filename) || [];

    const agentId = req.body.agentId as string;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      res.status(400).json({ status: false, message: "Agent not found" });
      return;
    }

    // Ensure additionalDetails is parsed correctly as an object
    let additionalDetails = req.body.additionalDetails;
    if (typeof additionalDetails === 'string') {
      try {
        additionalDetails = JSON.parse(additionalDetails);
      } catch (error) {
        res.status(400).json({
          status: false,
          message: "additionalDetails must be a valid JSON object",
        });
        return;
      }
    }

    // Ensure amenities is parsed correctly as an array
    let amenities = req.body.amenities;
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
        if (!Array.isArray(amenities)) {
          throw new Error("Amenities must be an array");
        }
      } catch (error) {
        res.status(400).json({
          status: false,
          message: "amenities must be a valid JSON array",
        });
        return;
      }
    }

    const propertyData: Partial<IProperty> = {
      ...req.body,
      additionalDetails,
      amenities,
      propertyImages: imageUrls,
      createdAt: new Date(),
    };

    const { error } = validateProperty(propertyData);
    if (error) {
      res.status(400).json({
        status: false,
        message: error.details.map((detail) => detail.message).join(", "),
      });
      return;
    }

    const newProperty = new Property(propertyData);
    const savedProperty = await newProperty.save();

    if (!fs.existsSync(propertiesDirPath)) {
      fs.mkdirSync(propertiesDirPath, { recursive: true });
    }

    let properties = [];
    if (fs.existsSync(propertiesFilePath)) {
      const data = fs.readFileSync(propertiesFilePath, "utf8");
      properties = JSON.parse(data);
    }

    properties.push(savedProperty.toObject());

    fs.writeFileSync(
      propertiesFilePath,
      JSON.stringify(properties, null, 2),
      "utf8"
    );

    res.status(201).json({
      status: true,
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export default createProperty;
