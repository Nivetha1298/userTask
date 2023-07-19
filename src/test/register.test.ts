import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { Connection, createConnection } from 'typeorm';
import app from '../app';
import { UserDao } from '../dao/userDao';
import { User } from '../entity/User';
import { authRoutes } from '../routes/authRoute';

chai.use(chaiHttp);

describe('Register API', () => {
  let connection: Connection;
  let userDao: UserDao;

  before(async () => {
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

  beforeEach(() => {
    sinon.restore();
  });

  it('should register a new user with valid data', async () => {
    const findUserByUsernameStub = sinon.stub(userDao, 'findUserByUsername');
    findUserByUsernameStub.onFirstCall().resolves(null);
    findUserByUsernameStub.onSecondCall().resolves(undefined);

    const findUserByEmailStub = sinon.stub(userDao, 'findUserByEmail').resolves(null);
    const createUserStub = sinon.stub(userDao, 'createUser').resolves(undefined);

    const res = await chai
      .request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'testuser@example.com',
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('User registered successfully');
    sinon.assert.calledOnce(findUserByUsernameStub);
    sinon.assert.calledOnce(findUserByEmailStub);
    sinon.assert.calledOnce(createUserStub);
  });

  it('should return a 400 error for missing required data', async () => {
    const res = await chai
      .request(app)
      .post('/auth/register')
      .send({});

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('Validation error');
    expect(res.body.details).to.be.an('array');
  });


  

});
