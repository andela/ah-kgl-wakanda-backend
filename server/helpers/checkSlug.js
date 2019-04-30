import { Article } from '../models';
/**
    *
    * returning the article's id for the slug given in url param.
    * @static
    * @param {object} req
    * @param {object} res
    * @returns {id} article id
    * @memberof Comments
    */
const checkSlug = async (req, res) => {
  const articleId = await Article.findOne({
    where: { slug: req.params.slug },
    attributes: ['id']
  });
  if (!articleId) {
    return res.status(404).json({
      status: 404,
      message: 'Article is not found.'
    });
  }
  return articleId.id;
};

export default checkSlug;
