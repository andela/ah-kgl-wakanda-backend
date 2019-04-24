import Joi from 'joi';

const schema = {
  comment: Joi.object().keys({
    comment: {
      body: Joi.string().required(),
    }
  }),
};

export default schema;
