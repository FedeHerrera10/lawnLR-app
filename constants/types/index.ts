import { z } from "zod";

export const loginSchema = z.object({
    username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario no puede tener más de 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "El usuario solo puede contener letras, números y guiones bajos"
    ),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  })

  
  export type LoginProps = z.infer<typeof loginSchema>;


  // Esquema para los roles
const rolesSchema = z.object({
  cliente: z.boolean(),
  admin: z.boolean(),
  veterinario: z.boolean()
});

// Esquema principal del usuario
export const userSchema = z.object({
  username: z.string()
    .min(3, "El username debe tener al menos 3 caracteres")
    .max(50, "El username no puede exceder 50 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "El username solo puede contener letras, números y guiones bajos"),
  
  firstname: z.string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  
  lastname: z.string()
    .min(1, "El apellido es obligatorio")
    .max(100, "El apellido no puede exceder 100 caracteres")
    .trim(),
  
  email: z.string()
    .email("Debe ser un email válido")
    .max(255, "El email no puede exceder 255 caracteres")
    .toLowerCase(),
  
  roles: rolesSchema,
  
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede exceder 128 caracteres"),
  
  document: z.string()
    .min(7 , "El documento debe tener al menos 7 dígitos")
    .max(8, "El documento no puede exceder 11 dígitos"),
  
  birthdate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Debe ser una fecha válida")
    .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      return birthDate <= today;
    }, "La fecha de nacimiento no puede ser futura")
});

// Tipo TypeScript inferido del esquema
export type User = z.infer<typeof userSchema>;


export const resendCodeSchema = z.object({
  email: z.string().email("Debe ser un email válido").max(255, "El email no puede exceder 255 caracteres").toLowerCase(),
});

export type ResendCodeProps = z.infer<typeof resendCodeSchema>;

export const changePasswordSchema = z
  .object({
    email: z.string().email("Debe ser un email válido").max(255, "El email no puede exceder 255 caracteres").toLowerCase(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // 👈 el error se muestra en el campo confirmPassword
  });


  export type changePasswordProps = z.infer<typeof changePasswordSchema>;
  export type changePasswordRequest = Pick<changePasswordProps, "email" | "password">;

