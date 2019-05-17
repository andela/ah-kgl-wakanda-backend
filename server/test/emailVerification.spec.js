import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

let loginToken;
