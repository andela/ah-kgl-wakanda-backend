import Joi from 'joi';

const schema = {
  comment: Joi.object().keys({
    comment: {
      body: Joi.string().required(),
    }
  }),
  idParam: {
    id: Joi.number().required(),
    slug: Joi.string().required(),
  }
};

export default schema;
