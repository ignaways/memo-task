import { Router } from "express";
import * as controller from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import validate from "../../middlewares/validate.js";
import authenticate from "../../middlewares/authenticate.js";
import { authLimiter } from "../../middlewares/rateLimiters.js";

const router = Router();

router.post("/register", authLimiter, validate({ body: registerSchema }), controller.register);
router.post("/login", authLimiter, validate({ body: loginSchema }), controller.login);
router.get("/me", authenticate, controller.me);

export default router;
