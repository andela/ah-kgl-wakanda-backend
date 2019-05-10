import Joi from 'joi';
// import passwordComplexity from 'joi-password-complexity';

const schema = {
  signUp: {
    firstname: Joi.string().trim().min(3).required(),
    lastname: Joi.string().trim().min(3).required(),
    username: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).required(),
  },
  logIn: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).required(),
  },
  update: {
    firstname: Joi.string().trim().min(3).required(),
    lastname: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    bio: Joi.string().trim().min(3).required(),
    image: Joi.string().uri().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/).required(),
  },
};

export default schema;
