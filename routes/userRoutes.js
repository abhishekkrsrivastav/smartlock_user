import express from 'express';
import {getUser, createUser, loginUser} from '../controllers/userControlller.js';

const router=express.Router();

// get all users || GET

router.get('/getall', getUser)

// get user by id
// router.get("/get/:id", getUserById);

// create user || post
router.post("/create", createUser);

// login user || post
router.post("/login", loginUser)

// update user
// router.put("/update/:id", updateUser);

export default router;