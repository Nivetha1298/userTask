import { expect } from 'chai';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../app';
import { User } from '../entity/User';
import { generateToken } from '../utils/jwt';
import { UserDao } from '../dao/userDao';
import { Connection, createConnection } from 'typeorm';

describe('Login API', () => {
    let connection: Connection;
    let userDao: UserDao;
  
    before(async () => {
      // Create a test database connection
      connection = await createConnection({
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: false,
        entities: [User],
      });
  
      userDao = new UserDao(connection); 
    });
  
    after(async () => {
      await connection.close();
    });
  
  it('should return a JWT token on successful login', async () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedPassword',
    };
    const generateTokenStub = sinon.stub(jwt, 'sign');
    generateTokenStub.returns('mocked_jwt_token');
    const token = generateToken(user);
    expect(token).to.equal('mocked_jwt_token');
    generateTokenStub.restore();
  });


  it('should return a 401 status for invalid login credentials', async () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedPassword',
    };

    const generateTokenStub = sinon.stub(jwt, 'sign');
    generateTokenStub.returns('mocked_jwt_token');
    const userDao = new UserDao(connection); 
    const findUserByUsernameStub = sinon.stub(userDao, 'findUserByUsername');
    findUserByUsernameStub.resolves(null); 
    const res = await chai
      .request(app)
      .post('/auth/login')
      .send({
        username: 'invaliduser',
        password: 'invalidpassword',
      });
    expect(res).to.have.status(401);
    generateTokenStub.restore();
    findUserByUsernameStub.restore();
  });

});
