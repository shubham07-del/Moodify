const express = require("express")

const authRouter = express.Router()
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")


/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", authController.registerController)

/**
 * @route POST /api/auth/login
 */
authRouter.post("/login", authController.loginController)


/**
 * @route GET /api/auth/get-me
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


/**
 * @route GET /api/auth/logout
 */
authRouter.get("/logout", authController.logoutUser)


module.exports = authRouter