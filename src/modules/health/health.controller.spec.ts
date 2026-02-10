import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HealthController } from './health.controller';
import type { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthCheckService: any;
  let mockMongooseHealthIndicator: any;

  beforeEach(() => {
    // Mock MongooseHealthIndicator
    mockMongooseHealthIndicator = {
      pingCheck: vi.fn(),
    };

    // Mock HealthCheckService
    mockHealthCheckService = {
      check: vi.fn(),
    };

    controller = new HealthController(mockHealthCheckService, mockMongooseHealthIndicator);
  });

  describe('check', () => {
    it('should return health check result', async () => {
      const expectedResult = {
        status: 'ok',
        info: {
          mongodb: {
            status: 'up',
          },
        },
        details: {
          mongodb: {
            status: 'up',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.check();

      expect(mockHealthCheckService.check).toHaveBeenCalledTimes(1);
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([expect.any(Function)]);
      expect(result).toEqual(expectedResult);
    });

    it('should check MongoDB connection with timeout', async () => {
      const mockPingResult = { mongodb: { status: 'up' } };
      mockMongooseHealthIndicator.pingCheck.mockResolvedValue(mockPingResult);

      // Simulate calling the health check function directly
      mockHealthCheckService.check.mockImplementation(async (checks: Function[]) => {
        // Execute the first check function
        await checks[0]();
        return {
          status: 'ok',
          info: mockPingResult,
          details: mockPingResult,
        };
      });

      await controller.check();

      // The pingCheck should have been called by the callback
      expect(mockMongooseHealthIndicator.pingCheck).toHaveBeenCalledWith('mongodb', {
        timeout: 1500,
      });
    });

    it('should return error status when MongoDB is down', async () => {
      const expectedResult = {
        status: 'error',
        error: {
          mongodb: {
            status: 'down',
            message: 'Connection timeout',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(expectedResult);

      const result = await controller.check();

      expect(result).toEqual(expectedResult);
      expect(result.status).toBe('error');
    });
  });
});
