import Joi from 'joi';

export const schema = {
  params: {
    id: Joi.number().required(),
    slug: Joi.string().required().trim(),
  }
};

export default (req, res, next) => {
  const comment = {
    comment: Joi.string().required().trim(),
  };

  const query = {
    start: Joi
      .number()
      .min(0)
      .required(),
    end: Joi
      .number()
      .min(0)
      .greater(Joi.ref('start'))
      .required()
  };

  const highlightQuery = Joi.validate(req.query, query);
  if (highlightQuery.error) {
    return res.status(400).json({
      message: highlightQuery.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
    });
  }
  const highlightComment = Joi.validate(req.body, comment);
  if (highlightComment.error) {
    return res.status(400).json({
      message: highlightComment.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
    });
  }

  next();
};
