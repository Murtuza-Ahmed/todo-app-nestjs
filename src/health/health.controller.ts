import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

/**
 * Health check endpoint for hosting platforms (Render, etc.).
 * Public by design — see Constants.PUBLIC_GET_URLS.
 *
 * GET / -> { status: 'ok', timestamp: '...' }
 */
@Controller()
@ApiTags('Health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
