import { CanActivate, ExecutionContext } from "@nestjs/common";

/**
 * RoleGuard is a custom guard that implements the CanActivate interface from NestJS. It is used to protect certain routes or endpoints by checking if the user has the required role to access them. The guard takes a role as a parameter and checks if the user's role matches the required role before allowing access to the route.
 */
export class RoleGuard implements CanActivate {

  /**
   * Constructor for RoleGuard, takes a role as a parameter and assigns it to the class property
   */
  private role: string;
  constructor(role: string) {
    this.role = role;
  }

  /**
   * Checks if the user has the required role to access the route
   * @param context 
   * @returns 
   */
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request: any = ctx.getRequest<Request>();
    const user = request.user;

    if (!user) {
      return false;
    }

    return user.role === this.role;
  }
}