import Joi from 'joi';

const schema = {
  report: {
    type: Joi.string().required(),
    message: Joi.string().trim().min(300).required()
  },
  slug: {
    slug: Joi.string().required(),
  },
  params: {
    slug: Joi.string().required(),
    id: Joi.number().required(),
  }
};

export default schema;
