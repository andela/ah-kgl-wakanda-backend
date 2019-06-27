import { User, Tags, Rating } from '../models';

/**
 * list of Models to include when fetching articles
 * It may grow as the need
 */
const includeQuery = [
  {
    model: User,
    attributes: ['username', 'firstname', 'lastname', 'email', 'image'],
  },
  {
    model: Tags,
  },
  {
    model: Rating,
    attributes: ['rate']
  }
];

export default includeQuery;
