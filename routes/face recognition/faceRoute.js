import express from "express";
import { AllGuestImages, guestInWithImage } from "../../controllers/face recognition/faceController.js";
// import { addUserImage, getAllUserImages, getImage, getUserByImagePath,   getUserImages,   saveImagePath } from "../../controllers/face recognition/faceController.js";
 

const router = express.Router();
// router.post("/save-path", saveImagePath);
// router.get("/get-user-by-image", getUserByImagePath)
// router.get("/get-image", getImage)
// router.post('/add-entrylog', saveEntryLog);


// final
// router.post("/add-image", addUserImage);         // Add new image (append to existing)
// router.get("/get-image/:user_id", getUserImages); // Get all images of a user
// router.get("/getallimages", getAllUserImages); 



router.post('/guest-image', guestInWithImage);

/**
 * @swagger
 * /guest-image:
 *   post:
 *     summary: Guest entry with identity check and image path
 *     tags: [Face-Detection]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guest_name
 *               - age_id
 *               - gender_id
 *               - device_id
 *               - image_path
 *             properties:
 *               guest_name:
 *                 type: string
 *                 example: "Rahul Sharma"
 *               age_id:
 *                 type: integer
 *                 example: 2
 *               gender_id:
 *                 type: integer
 *                 example: 1
 *               device_id:
 *                 type: integer
 *                 example: 5
 *               image_path:
 *                 type: string
 *                 example: "/images/rahul1.png"
 *     responses:
 *       201:
 *         description: Guest IN recorded with image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Guest IN recorded with identity check
 *                 in_time:
 *                   type: string
 *                   example: "2025-05-17T10:20:30.000Z"
 *                 guest_visit_id:
 *                   type: integer
 *                   example: 12
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

router.get("/allguestimages", AllGuestImages);

/**
 * @swagger
 * /allguestimages:
 *   get:
 *     summary: Get all guest images with their name and device
 *     tags: [Face-Detection]
 *     responses:
 *       200:
 *         description: Successfully retrieved all guest images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   guest_name:
 *                     type: string
 *                     example: "Rahul Sharma"
 *                   device_id:
 *                     type: integer
 *                     example: 3
 *                   image_paths:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["/images/rahul1.png", "/images/rahul2.png"]
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */



export default router;

