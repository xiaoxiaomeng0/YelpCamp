const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const Joi = BaseJoi.extend((joi) => {
  return {
    type: "string",
    base: joi.string(),
    messages: {
      "string.escapeHTML": "{{#label}} should not include HTML",
    },
    rules: {
      escapeHtml: {
        validate(value, helpers) {
          const clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
          if (clean !== value)
            return helpers.error("string.escapeHTML", { value });
          return clean;
        },
      },
    },
  };
});

const campJoiSchema = Joi.object({
  campground: Joi.object({
    name: Joi.string().required().escapeHtml(),
    location: Joi.string().required().escapeHtml(),
    price: Joi.number().min(0).required(),
    // images: Joi.string().optional(),
    description: Joi.string().required().escapeHtml(),
  }).required(),
  deleteImages: Joi.array(),
});

const reviewJoiSchema = Joi.object({
  rate: Joi.number().min(1).max(5).required(),
  content: Joi.string().required().escapeHtml(),
}).required();

const userJoiSchema = Joi.object({
  username: Joi.string().required().escapeHtml(),
  email: Joi.string()
    .escapeHtml()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().required().escapeHtml(),
}).required();

module.exports = { campJoiSchema, reviewJoiSchema, userJoiSchema };
