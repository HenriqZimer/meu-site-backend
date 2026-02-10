import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let mockReflector: any;
  let mockExecutionContext: any;

  beforeEach(() => {
    // Mock Reflector
    mockReflector = {
      getAllAndOverride: vi.fn(),
    };

    // Mock ExecutionContext
    mockExecutionContext = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn(() => ({
        getRequest: vi.fn(() => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        })),
      })),
    } as unknown as ExecutionContext;

    guard = new JwtAuthGuard(mockReflector);
  });

  describe('canActivate', () => {
    it('should allow access to public routes', () => {
      // Mock route decorated with @Public()
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(result).toBe(true);
    });

    it('should call super.canActivate for protected routes', () => {
      // Mock route without @Public() decorator
      mockReflector.getAllAndOverride.mockReturnValue(false);

      // Mock super.canActivate to return true
      const superCanActivateSpy = vi
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(true);

      superCanActivateSpy.mockRestore();
    });

    it('should call super.canActivate when isPublic is undefined', () => {
      // Mock route without decorator (returns undefined)
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const superCanActivateSpy = vi
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockReturnValue(true);

      const result = guard.canActivate(mockExecutionContext);

      expect(superCanActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(true);

      superCanActivateSpy.mockRestore();
    });
  });
});
