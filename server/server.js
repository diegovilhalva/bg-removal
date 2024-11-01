import 'dotenv/config'
import express from "express"
import cors from "cors"
import connectDB from './configs/mongodb.js'


const PORT = process.env.PORT || 4000


const app = express()

app.use(express.json())
app.use(cors())
await connectDB()


app.get("/",(req,res) => {
    res.send("ok")
})



app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})