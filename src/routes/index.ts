import { Router } from "express";

import { HealthController } from "../controllers/health.controller";
import { authRoutes } from "../modules/auth/routes/auth.routes";
import { usersRoutes } from "../modules/users/routes/users.routes";

const router = Router();
const healthController = new HealthController();

router.get("/health", (request, response) => healthController.check(request, response));
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

export { router };
