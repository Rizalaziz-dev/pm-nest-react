import { z } from "zod";

export const registerScheme = z.object({
    name: z.string().min(2).max(30),
    email:z.string().email(),
    role: z.string().min(2).max(30),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
})
.refine((data)=> data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerScheme>;