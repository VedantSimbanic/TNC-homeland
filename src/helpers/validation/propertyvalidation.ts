import Joi from "joi";

const additionalDetailsSchema = Joi.object({
  BuildingAge: Joi.string().required(),
  PropertyType: Joi.string().required(),
  PropertyStatus: Joi.string().required(),
  Gas: Joi.string().required(),
  Heating: Joi.string().required(),
  Storage: Joi.string().required(),
});
export const propertyValidationSchema = Joi.object({
  agentId: Joi.string().required(),
  title: Joi.string().required(),
  propertyImages: Joi.array().items(Joi.string()).required(),
  price: Joi.string().required(),
  category: Joi.string().required(),
  propertySizeCategory: Joi.string().required(),
  address: Joi.string().required(),
  size: Joi.string().required(),
  bedrooms: Joi.number().integer().min(0).required(),
  bathrooms: Joi.number().integer().min(0).required(),
  propertyDescription: Joi.string().required(),
  additionalDetails: additionalDetailsSchema.required(),
  amenities: Joi.array().items(Joi.string()).required(),
  viewVideoUrl: Joi.string().required(),
  mapLocation: Joi.string().required(),
  createdAt: Joi.date().default(Date.now),
});

export const validateProperty = (property: any) => {
  return propertyValidationSchema.validate(property);
};
