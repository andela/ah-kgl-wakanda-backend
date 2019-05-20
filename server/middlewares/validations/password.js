import Joi from 'joi';

const schema = {
  email: {
    email: Joi.string()
      .email()
      .trim()
      .required(),
  },

  password: {
    password: Joi.string()
      .min(8)
      .alphanum()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/)
      .required(),
  }
};


export default schema;
