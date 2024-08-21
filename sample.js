const request = require('supertest');
const app = require('../app'); // Assuming the Flask app is exported from a file named 'app.js'

describe('Weather API', () => {
  // Test the '/api/weather' endpoint
  describe('GET /api/weather', () => {
    // Test successful response
    it('should return a valid weather data', async () => {
      // Arrange
      // Mock the sensor data
      jest.spyOn(Adafruit_DHT, 'read_retry').mockReturnValue([50, 25]);
      jest.spyOn(BH1750, 'read_light').mockReturnValue(1000);
      jest.spyOn(measure_distance, 'measure_distance').mockReturnValue(10);

      // Act
      const response = await request(app).get('/api/weather');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        temperature: 25,
        humidity: 50,
        light: 1000,
        distance: 10,
      });
    });

    // Test error response
    it('should return an error when sensor data cannot be read', async () => {
      // Arrange
      // Mock the sensor data to return `None`
      jest.spyOn(Adafruit_DHT, 'read_retry').mockReturnValue([null, null]);

      // Act
      const response = await request(app).get('/api/weather');

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get reading from the sensor' });
    });
  });
});
