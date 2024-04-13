import { MenuItem } from "primeng/api";

export interface Functionality extends MenuItem{
    color?: string;
    description?: string;
    items?: Functionality[];
}