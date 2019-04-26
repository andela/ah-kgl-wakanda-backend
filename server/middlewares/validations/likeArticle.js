import Joi from 'joi';

const schema = {
  params: {
    slug: Joi.string().required().trim(),
  },
};

export default schema;
