import { Request, Response } from "express";
import Property, { IProperty } from "../../models/property";
import { validateProperty } from "../../helpers/validation/propertyvalidation";
import path from "path";
import fs from "fs";
import Agent from "../../models/agent";

const propertiesDirPath = path.join(__dirname, "../../data");
const propertiesFilePath = path.join(propertiesDirPath, "properties.json");

const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const propertyId = req.params.id;
    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = files?.map((file) => file.filename) || [];

    const agentId = req.body.agentId as string;

    const agent = await Agent.findById(agentId);
    if (!agent) {
      res.status(400).json({ status: false, message: "Agent not found" });
      return;
    }

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

    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) {
      res.status(404).json({ status: false, message: "Property not found" });
      return;
    }

    const propertyData: Partial<IProperty> = {
      ...req.body,
      additionalDetails,
      amenities,
      propertyImages: imageUrls.length ? imageUrls : existingProperty.propertyImages,
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

    const updatedProperty = await Property.findByIdAndUpdate(propertyId, propertyData, { new: true });
    if (!updatedProperty) {
      res.status(404).json({ status: false, message: "Property not found" });
      return;
    }

    if (!fs.existsSync(propertiesDirPath)) {
      fs.mkdirSync(propertiesDirPath, { recursive: true });
    }

    let properties = [];
    if (fs.existsSync(propertiesFilePath)) {
      const data = fs.readFileSync(propertiesFilePath, "utf8");
      properties = JSON.parse(data);
    }

    const propertyIndex = properties.findIndex((p: IProperty) => p._id === propertyId);
    if (propertyIndex > -1) {
      properties[propertyIndex] = updatedProperty.toObject();
    } else {
      properties.push(updatedProperty.toObject());
    }

    fs.writeFileSync(
      propertiesFilePath,
      JSON.stringify(properties, null, 2),
      "utf8"
    );

    res.status(200).json({
      status: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export default updateProperty;
