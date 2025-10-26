import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email tidak boleh kosong",
        "string.email": "Format email tidak valid",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password tidak boleh kosong",
        "string.min": "Password minimal 6 karakter",
    }),
})

export default loginSchema;