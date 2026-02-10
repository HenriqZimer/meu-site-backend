import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: any;
  let mockExecutionContext: any;
  let mockRequest: any;

  beforeEach(() => {
    // Mock Reflector
    mockReflector = {
      getAllAndOverride: vi.fn(),
    };

    // Mock Request
    mockRequest = {
      user: null,
    };

    // Mock ExecutionContext
    mockExecutionContext = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn(() => ({
        getRequest: vi.fn(() => mockRequest),
      })),
    } as unknown as ExecutionContext;

    guard = new RolesGuard(mockReflector);
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      // No @Roles() decorator present
      mockReflector.getAllAndOverride.mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
      expect(result).toBe(true);
    });

    it('should allow access when required roles array is empty', () => {
      // @Roles() with no arguments
      mockReflector.getAllAndOverride.mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      // @Roles('admin')
      mockReflector.getAllAndOverride.mockReturnValue(['admin']);
      mockRequest.user = null;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Acesso negado: usuário não autenticado',
      );
    });

    it('should allow access when user has required role', () => {
      // @Roles('admin')
      mockReflector.getAllAndOverride.mockReturnValue(['admin']);
      mockRequest.user = { id: '123', role: 'admin' };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles', () => {
      // @Roles('admin', 'moderator')
      mockReflector.getAllAndOverride.mockReturnValue(['admin', 'moderator']);
      mockRequest.user = { id: '123', role: 'moderator' };

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user does not have required role', () => {
      // @Roles('admin')
      mockReflector.getAllAndOverride.mockReturnValue(['admin']);
      mockRequest.user = { id: '123', role: 'user' };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Acesso negado: necessário ter uma das roles: admin',
      );
    });

    it('should throw ForbiddenException with all required roles when user lacks any of them', () => {
      // @Roles('admin', 'moderator')
      mockReflector.getAllAndOverride.mockReturnValue(['admin', 'moderator']);
      mockRequest.user = { id: '123', role: 'user' };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'Acesso negado: necessário ter uma das roles: admin, moderator',
      );
    });
  });
});
