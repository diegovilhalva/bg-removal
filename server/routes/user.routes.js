import express from "express"
import { clerkWebooks, userCredits } from "../controllers/user.controller.js"
import authUser from "../middlewares/auth.js"

const router = express.Router()

router.post("/webhooks",clerkWebooks)
router.get("/credits",authUser,userCredits)



export default router