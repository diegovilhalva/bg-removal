import express from "express"
import { clerkWebooks, paymentStripe, userCredits, verifyStripe } from "../controllers/user.controller.js"
import authUser from "../middlewares/auth.js"

const router = express.Router()

router.post("/webhooks",clerkWebooks)
router.get("/credits",authUser,userCredits)
router.post("/payment",authUser,paymentStripe)
router.post("/verify-payment",authUser,verifyStripe)

export default router