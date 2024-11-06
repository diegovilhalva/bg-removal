import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    clerkId: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    date: { type: Number }
})

const Transaction = mongoose.models.transaction || mongoose.model("transaction",transactionSchema)

export default Transaction