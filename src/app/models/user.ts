import { Rol } from "./rol";

export class User{
    id: number;
    username: string;
    password: string;
    activo: string;
    roles: Rol[];
}