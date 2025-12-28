import { RegisterFormData } from "../../auth/schemas/register.schemas";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export type UserFormData = RegisterFormData;