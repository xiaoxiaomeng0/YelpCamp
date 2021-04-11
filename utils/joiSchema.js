const Joi = require("joi");

const campJoiSchema = Joi.object({
  campground: Joi.object({
    name: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    // images: Joi.string().optional(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

const reviewJoiSchema = Joi.object({
  rate: Joi.number().min(1).max(5).required(),
  content: Joi.string().required(),
}).required();

const userJoiSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required(),
}).required();

module.exports = { campJoiSchema, reviewJoiSchema, userJoiSchema };
