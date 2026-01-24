import { z } from "zod";

// 1. ✅ DEFINE THE ENUM INSIDE ZOD FIRST
// This is your single source of truth.
export const RoleEnum = z.enum([
    "ADMIN",
    "PM",
    "REQUESTER",
    "PRODUCTION_LEAD",
    "OPERATOR_BREAKDOWN", 
    "ENGINEER_JOINT",
    "ENGINEER_HOUSING",
    "ENGINEER_JIG",
    "ENGINEER_VISUAL",
    "ENGINEER_JS_ACC",
    "ENGINEER_JS_FIN"
]);

// 2. EXTRACT THE LIST FOR YOUR UI
// Use this variable in your <select> map inside CreateForm
export const VALID_ROLES = RoleEnum.options; 

// 3. The Core Data
export const userCoreSchema = z.object({
    name: z.string().min(2, "Name is too short").max(30),
    email: z.string().email("Invalid email format"),
    
    // ✅ USE THE ENUM HERE
    role: RoleEnum, 
});

// 4. The Full Registration Schema
export const registerScheme = userCoreSchema.extend({
    password: z.string().min(6, "Password must be at least 6 characters").max(30),
    confirmPassword: z.string().min(6).max(30),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// 5. Types
export type RegisterFormData = z.infer<typeof registerScheme>;


export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: "ADMIN"|
    "PM"|
    "REQUESTER"|
    "PRODUCTION_LEAD"|
    "OPERATOR_BREAKDOWN"| 
    "ENGINEER_JOINT"|
    "ENGINEER_HOUSING"|
    "ENGINEER_JIG"|
    "ENGINEER_VISUAL"|
    "ENGINEER_JS_ACC"|
    "ENGINEER_JS_FIN"
  
  // ✅ The password field is now included!
  password: string; 
  
  createdAt: string; 
  updatedAt: string;
}