import express from 'express';
import SignUpController from '../controllers/SignUp.Controller.js';
import SignInController from '../controllers/SignIn.Controller.js';
import authToken from '../middleware/AuthToken.middleware.js';
import { getUserByID, getAllUsers, updateUser, deleteUser } from '../controllers/userDetails.Controller.js';

const router = express.Router();

router.post("/signup", SignUpController);
router.post("/signin", SignInController);
router.get("/user-details/:id", authToken, getUserByID);
router.get("/users", authToken, getAllUsers);
router.put("/user-details/:id", authToken, updateUser);  // Changed to PUT
router.delete("/user-details/:id", authToken, deleteUser); // Changed to DELETE

export default router;
