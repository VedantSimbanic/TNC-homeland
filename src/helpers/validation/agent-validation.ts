import Joi from 'joi';

export const validateAgentRegistration = (data: any) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

return schema.validate(data);
};
