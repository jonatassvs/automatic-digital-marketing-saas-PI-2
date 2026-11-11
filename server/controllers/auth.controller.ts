import type { AuthService } from "../services/auth.service";
import { data, empty, readJson, type ControllerContext } from "./http";
export class AuthController {
  constructor(private service: AuthService) {}
  register = async ({ request }: ControllerContext) => data(await this.service.register(await readJson(request)), 201);
  login = async ({ request }: ControllerContext) => data(await this.service.login(await readJson(request)));
  logout = async ({ token }: ControllerContext) => { await this.service.logout(token); return empty(); };
  me = async ({ token }: ControllerContext) => data(await this.service.authenticate(token));
}
