import { z } from "zod";

// export const registerScheme = z.object({
//     name: z.string().min(2).max(30),
//     email:z.string().email(),
//     role: z.string().min(2).max(30),
//     password: z.string().min(6).max(30),
//     confirmPassword: z.string().min(6).max(30),
// })
// .refine((data)=> data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
// });

// export type RegisterFormData = z.infer<typeof registerScheme>;

// 1. The Core Data (Common for both Create and Edit)
export const userCoreSchema = z.object({
    name: z.string().min(2).max(30),
    email: z.string().email(),
    role: z.string().min(2).max(30),
});

// 2. The Full Registration Schema (Used for the Register Form)
export const registerScheme = userCoreSchema.extend({
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// 3. Types
export type RegisterFormData = z.infer<typeof registerScheme>;
// This is what your Table and Edit state should use!
export type UserEntity = z.infer<typeof userCoreSchema> & { id: string };