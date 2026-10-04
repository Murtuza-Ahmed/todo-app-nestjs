import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Constants } from 'src/utils/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    // Strip query strings ("/auth/login?x=1" must still match the bypass list)
    const path = request.url.split('?')[0].replace(/\/+$/, '') || '/';

    for (let x = 0; x < Constants.BY_PASS_URLS.length; x++) {
      if (path === Constants.BY_PASS_URLS[x] && request.method === 'POST')
        return true;
    }

    return super.canActivate(context);
  }
}
