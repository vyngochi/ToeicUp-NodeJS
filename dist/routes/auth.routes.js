"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_controller_1 = require("@app/controllers/auth/login.controller");
const authenticate_1 = require("@app/middlewares/authenticate");
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/login", authenticate_1.authenticate, login_controller_1.loginController);
exports.default = router;
