import {Role} from "./role";

export class User {
  id: number;
  username: string;
  password: string;
  activo: string;
  roles: Role[];
}
