import Joi from 'joi';
// import passwordComplexity from 'joi-password-complexity';

const schema = {
  signUp: {
    username: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).required(),
  },
  logIn: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).required(),
  }
};

export default schema;
