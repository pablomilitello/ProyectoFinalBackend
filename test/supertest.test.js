import '../src/DAL/mongoDB/dbConfig.js';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { ROLE_ADMIN, ROLE_USER } from '../src/DAL/mongoDB/models/users.model.js';

function generateRandomString(chars) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < chars; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset.charAt(randomIndex);
  }

  return randomString;
}

const getProductForTest = () => ({
  title: generateRandomString(15),
  description: generateRandomString(50),
  category: generateRandomString(20),
  price: 5,
  thumbnail: [],
  code: generateRandomString(6),
  stock: 1500,
  status: true,
  owner: ROLE_ADMIN,
});

const getAuthTokenAdmin = async () => {
  const loginRes = await request(app)
    .post('/register/login')
    .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });
  const cookieString = loginRes.headers['set-cookie'][0];
  const tokenPattern = /connect\.sid=([^;]+)/;
  const match = tokenPattern.exec(cookieString);
  return `connect.sid=${match?.[1]}`;
};

const getAuthTokenPremium = async () => {
  const loginRes = await request(app).post('/register/login').send({ email: 'psapo@mail.com', password: '12345' });
  const cookieString = loginRes.headers['set-cookie'][0];
  const tokenPattern = /connect\.sid=([^;]+)/;
  const match = tokenPattern.exec(cookieString);
  return `connect.sid=${match?.[1]}`;
};

//Testing Products
describe('Testing Products Router from Mongo DB', function () {
  it('Must return all products', async function () {
    const response = await request(app).get('/api/products');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.be.an('array');
  });

  it('The test must add a product to the DB', async function () {
    const authToken = await getAuthTokenAdmin();
    const testProduct = getProductForTest();
    const response = await request(app).post('/api/products').set('Cookie', authToken).send(testProduct);
    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body.product).to.have.property('_id');
    expect(response.body.product.code).to.equal(testProduct.code);
  });

  it('Must return one product', async function () {
    const authToken = await getAuthTokenAdmin();
    const testProduct = getProductForTest();
    const createProduct = await request(app).post('/api/products').set('Cookie', authToken).send(testProduct);
    const id = createProduct.body.product._id;
    const response = await request(app).get(`/api/products/${id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body.code).to.equal(testProduct.code);
    expect(response.body.title).to.equal(testProduct.title);
  });
});

//Testing Carts
describe('Testing Carts Router from Mongo DB', function () {
  it('Must create one cart', async function () {
    const authToken = await getAuthTokenAdmin();
    const response = await request(app).post('/api/carts').set('Cookie', authToken);
    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body.message).to.equal('Cart created');
    expect(response.body.cart).to.be.an('object');
    expect(response.body.cart).to.have.property('_id');
  });

  it('Must return one cart', async function () {
    const authToken = await getAuthTokenAdmin();
    const createCart = await request(app).post('/api/carts').set('Cookie', authToken);
    const id = createCart.body.cart._id;
    const response = await request(app).get(`/api/carts/${id}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('_id');
    expect(response.body.products).to.be.an('array');
  });

  it('Must delete one cart', async function () {
    const authTokenPremium = await getAuthTokenPremium();
    const createCart = await request(app).post('/api/carts').set('Cookie', authTokenPremium);
    const cid = createCart.body.cart._id;

    const authTokenAdmin = await getAuthTokenAdmin();
    const testProduct = getProductForTest();
    const createProduct = await request(app).post('/api/products').set('Cookie', authTokenAdmin).send(testProduct);
    const pid = createProduct.body.product._id;

    const response = await request(app).post(`/api/carts/${cid}/product/${pid}`).set('Cookie', authTokenPremium);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body._id).to.equal(cid);
    expect(response.body.products).to.be.an('array');
  });
});

//Testing Sessions
describe('Should test Session Router', function () {
  it('Must return current session', async function () {
    const authTokenPremium = await getAuthTokenPremium();
    const response = await request(app).get('/api/sessions/current').set('Cookie', authTokenPremium);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body.email).to.equal('psapo@mail.com');
  });

  it('It will not return current session', async function () {
    const authTokenPremium = await getAuthTokenPremium();
    const response = await request(app).get('/api/sessions/current');
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Session expired');
  });
});
