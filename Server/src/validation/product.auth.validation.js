import Joi from "joi";
export const productCreation = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  details: Joi.string().required(),
  quantity: Joi.string().required(),
  rating: Joi.number(),
}).unknown(true);
