import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class ThrottleGuard implements CanActivate {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests: number = 100;
  private readonly windowMs: number = 60000;

  constructor() {
  }

  static create(maxRequests: number = 100, windowMs: number = 60000): ThrottleGuard {
    const guard = new ThrottleGuard();
    (guard as any).maxRequests = maxRequests;
    (guard as any).windowMs = windowMs;
    return guard;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientId = this.getClientId(request);
    const now = Date.now();

    this.cleanup();

    const clientData = ThrottleGuard.requests.get(clientId);

    if (!clientData) {
      ThrottleGuard.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (now > clientData.resetTime) {
      ThrottleGuard.requests.set(clientId, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (clientData.count >= this.maxRequests) {
      throw new BadRequestException('Rate limit exceeded. Please try again later.');
    }

    clientData.count++;
    return true;
  }

  private getClientId(request: any): string {
    return request.ip || request.connection?.remoteAddress || 'unknown';
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of ThrottleGuard.requests.entries()) {
      if (now > value.resetTime) {
        ThrottleGuard.requests.delete(key);
      }
    }
  }
}
