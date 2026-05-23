import {z} from 'zod';


export const registerSchema=z.object({
    body:z.object({
        name:z.string().trim().min(3,"Name must be at least 3 characters"),
        email:z.string().email("Invalid email format"),
        password:z.string().min(6,"Password should contain atleast 6 characters"),
    })
})

export const loginSchema=z.object({
    body:z.object({
        email:z.string().email("Invalid email format"),
        password:z.string().min(1,"Password required")
    })
})