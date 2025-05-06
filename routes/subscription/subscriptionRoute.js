import express from 'express';
import { requireSignIn } from '../../middleware/smartLock/requireSignIn.js';
import { assignSubscription, createSubscriptionPlan, getAllSubscriptions, getSubscriptionDetails } from '../../controllers/subscription/subscriptionController.js';

const router = express.Router();

// Create a new subscription plan (Admin)
router.post('/add-subscription', requireSignIn, createSubscriptionPlan);

// Assign a subscription for a customer (Admin and vendor)
router.post("/assign-subscription", requireSignIn, assignSubscription)

// Get details of subscriptions (Admin , Vendor for own customers)
router.get("/get-subscriptions", requireSignIn, getAllSubscriptions);

// get details by id
router.get("/get-subscriptions/:Id", requireSignIn, getSubscriptionDetails);



export default router;

