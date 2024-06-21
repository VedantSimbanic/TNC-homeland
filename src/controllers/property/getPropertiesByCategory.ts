import { Request, Response } from 'express';
import Property, { IProperty } from '../../models/property';

const getPropertiesByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.query;

        if (!category) {
            res.status(400).json({
                status: false,
                message: "Category is required in the query parameters",
            });
            return;
        }

        if (category !== 'sale' && category !== 'rent') {
            res.status(400).json({
                status: false,
                message: "Invalid category. Category must be either 'sale' or 'rent'.",
            });
            return;
        }

        const properties: IProperty[] = await Property.find({ category: category as string }).exec();

        if (properties.length === 0) {
            res.status(404).json({
                status: false,
                message: `No properties found for category: ${category}`,
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

export default getPropertiesByCategory;
