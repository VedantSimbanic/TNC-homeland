import { Request, Response } from 'express';
import Property, { IProperty } from '../../models/property';

const getPropertiesBySizeCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertySizeCategory } = req.query;

    if (!propertySizeCategory || (propertySizeCategory !== 'small' && propertySizeCategory !== 'big')) {
      res.status(400).json({
        status: false,
        message: "Invalid query parameter. 'propertySizeCategory' must be either 'small' or 'big'."
      });
      return;
    }

    const properties: IProperty[] = await Property.find({ propertySizeCategory }).exec();

    if (properties.length === 0) {
      res.status(404).json({
        status: false,
        message: `No properties found for category: ${propertySizeCategory}`,
      });
      return;
    }

    res.status(200).json({
      status: true,
      data: properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export default getPropertiesBySizeCategory;
