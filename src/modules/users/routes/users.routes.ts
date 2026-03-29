import { Router } from "express";

import { SequelizeUserRepository } from "../../auth/repositories/sequelize-user.repository";
import { UsersController } from "../controllers/users.controller";
import { CreateUserService } from "../services/create-user.service";

const usersRoutes = Router();
const userRepository = new SequelizeUserRepository();
const createUserService = new CreateUserService(userRepository);
const usersController = new UsersController(createUserService);

usersRoutes.post("/", (request, response) => usersController.create(request, response));

export { usersRoutes };
