const request = require('supertest');

const app = require('../../app');
const { 
  mongoConnect,
  mongoDisconnet,
} = require('../../services/mongo');


describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnet();
  });

  describe('Test GET /launches', () => {
    test('It should response with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
  
  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
      launchDate: 'December 27, 2030'
    }
  
    const launchDataWithoutDate = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b'
    }
  
    const launchDataWithInvalidDate = {
      mission: 'Kepler Exploration X',
      rocket: 'Explorer IS1',
      target: 'Kepler-442 b',
      launchDate: 'zoot'
    }
  
    test('It should response with 201 success', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
  
      // Matches objects partially
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });  
    });
  });

});
