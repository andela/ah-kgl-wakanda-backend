import Joi from 'joi';

const schema = {
  params: {
    slug: Joi.string().required().trim(),
    channel: Joi.string().valid([
      'facebook',
      'twitter',
      'mail',
    ]),
  },
};

export default schema;
