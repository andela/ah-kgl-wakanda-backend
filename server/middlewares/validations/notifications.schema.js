import Joi from 'joi';

const schema = {
  idParam: {
    id: Joi.number().required(),
  }
};

export default schema;
