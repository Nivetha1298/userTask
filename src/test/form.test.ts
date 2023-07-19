const chai = require('chai');
const chaiHttp = require('chai-http');
import app from '../app';
import { FormDao } from '../dao/formDao'

chai.use(chaiHttp);
const expect = chai.expect;
let connection:any 

const formDao = new FormDao(connection)
const formData = {
    name: 'stri,ng',
    email: 'j@gmsil.com',
    phoneNumber: '12345',
    message: 'sfnjdfjkl',
    photo: 'string',
  };
describe('POST /form', () => {
  it('should submit a new form and return 201 status', async () => {y
    formDao.saveForm = async (data) => {
      expect(data).to.deep.equal(formData);
    };
    const response = await chai
      .request(app)
      .post('/form')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInVzZXJuYW1lIjoibml2ZXRoYSIsImVtYWlsIjoibml2ZXRoYUBnbWFpbC5jb20iLCJpYXQiOjE2ODk3NjE3ODcsImV4cCI6MTY4OTc2NTM4N30.R9tpd25VX999KO7xbxsssZzlfYLOximcAXZbRgoggUY') // Include a valid JWT token
      .send(formData);
    expect(response).to.have.status(201);
    expect(response.body).to.deep.equal({ message: 'Form submitted successfully' });
  });
});

describe('GET /form', () => {
    it('should fetch paginated forms and return 200 status', async () => {
      const response = await chai
        .request(app)
        .get('/form')
        .query({ page: 1, pageSize: 10 }) 
       expect(response).to.have.status(200);
       expect(response.body).to.be.an('object');
      
    });
  
   
  });

  describe('GET /form/{id}', () => {
    it('should fetch a form by ID and return 200 status', async () => {
      formDao.getFormById = async (id) => {
        expect(id).to.equal(1);
        return formData;
      };
      const response = await chai
        .request(app)
        .get('/form/1')
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal(formData);
    });
  
  });

  describe('PUT /form/{id}', () => {
    it('should update a form by ID and return 200 status', async () => {
      formDao.getFormById = async (id, data) => {
        expect(id).to.equal(1); 
        expect(data).to.deep.equal(formData); 
        return true; 
      };
      const response = await chai
        .request(app)
        .put('/form/1') 
        .send(formData);
      expect(response).to.have.status(200); 
    });
  });

  describe('DELETE /form/{id}', () => {
    it('should delete a form by ID and return 204 status', async () => {

      formDao.deleteForm = async (id) => {
        expect(id).to.equal(1);
        return true; 
      };
      const response = await chai
        .request(app)
        .delete('/form/1')
      expect(response).to.have.status(204);
    });
  });
  
  