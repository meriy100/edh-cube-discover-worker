import { handleGetRequest, handlePostRequest } from '../src/index';
import { Request, Response } from 'express';

// Mock Express Request and Response
const mockRequest = (overrides?: any): Request => {
  return {
    method: 'GET',
    query: {},
    body: {},
    headers: {},
    ...overrides,
  } as Request;
};

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('EDH Cube Discover Worker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleGetRequest', () => {
    it('should handle GET request successfully', () => {
      const req = mockRequest({
        query: { test: 'value' },
      });
      const res = mockResponse();

      handleGetRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'EDH Cube Discover Worker is running',
        timestamp: expect.any(String),
        method: 'GET',
        query: { test: 'value' },
      });
    });

    it('should handle GET request with empty query', () => {
      const req = mockRequest({
        query: {},
      });
      const res = mockResponse();

      handleGetRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'EDH Cube Discover Worker is running',
        timestamp: expect.any(String),
        method: 'GET',
        query: {},
      });
    });
  });

  describe('handlePostRequest', () => {
    it('should handle POST request successfully', () => {
      const req = mockRequest({
        method: 'POST',
        body: { data: 'test data' },
      });
      const res = mockResponse();

      handlePostRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'POST request processed successfully',
        timestamp: expect.any(String),
        method: 'POST',
        receivedData: { data: 'test data' },
      });
    });

    it('should handle POST request with empty body', () => {
      const req = mockRequest({
        method: 'POST',
        body: {},
      });
      const res = mockResponse();

      handlePostRequest(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'POST request processed successfully',
        timestamp: expect.any(String),
        method: 'POST',
        receivedData: {},
      });
    });
  });
});