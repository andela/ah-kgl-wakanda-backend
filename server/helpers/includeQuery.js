import {
  User, Tags, Rating
} from '../models';

const includeQuery = [
  {
    model: User,
    attributes: ['username', 'email', 'image'],
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
