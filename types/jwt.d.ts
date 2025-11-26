import "jwt-decode";

declare module "jwt-decode" {
  export interface JwtPayload {
    user?: string;
    sub?: string;
  }
}
