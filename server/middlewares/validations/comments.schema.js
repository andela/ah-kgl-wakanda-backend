import Joi from 'joi';

const schema = {
  comment: Joi.object().keys({
    comment: {
      body: Joi.string().required().trim(),
    }
  }),
  idParam: {
    id: Joi.number().required(),
    slug: Joi.string().required().trim(),
  }
};

export default schema;
