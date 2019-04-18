import Joi from 'joi';

export default schema => (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    if (result.error.details[0].type === 'string.regex.base') {
      return res.status(400).json({
        status: 400,
        message: 'Your password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number',
      });
    }
    return res.status(400).json({
      status: 400,
      message: result.error.details[0].message.replace(/[^a-zA-Z ]/g, ''),
    });
  }
  next();
};
