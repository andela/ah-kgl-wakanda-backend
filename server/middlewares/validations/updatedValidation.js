import Joi from 'joi';

export default (schema, param = false) => (req, res, next) => {
  const result = Joi.validate(param ? req.params : req.body, schema, { abortEarly: false });
  if (result.error) {
    const joiMessages = result.error.details.map((joiMessage) => {
      const message = joiMessage.type === 'string.regex.base' ? 'Your password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number' : joiMessage.message.replace(/[^a-zA-Z ]/g, '');
      return message;
    });
    return res.status(400).json({
      status: 400,
      message: joiMessages,
    });
  }
  next();
};
