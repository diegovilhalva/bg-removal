import express from "express"
import { clerkWebooks } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/webhooks",clerkWebooks)



export default router