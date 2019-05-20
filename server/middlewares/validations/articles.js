import Joi from 'joi';

const schema = {
  create: Joi.object().keys({
    article: {
      title: Joi.string().required(),
      description: Joi.string().required(),
      body: Joi.string().required(),
      images: Joi.array(),
      Tags: Joi.array()
    }
  }),

  update: Joi.object().keys({
    article: {
      title: Joi.string(),
      description: Joi.string(),
      body: Joi.string()
    }
  }),
};


export default schema;
