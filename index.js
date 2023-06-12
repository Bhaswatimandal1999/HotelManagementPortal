const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const swaggerJSdoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")
const { userRouter } = require("./routes/user.routes")
const jwt = require("jsonwebtoken")

require("dotenv").config()

const app = express()

app.use(express.json())


const connection = async () => {
    try {
        await mongoose.connect(process.env.mongoURL)
        console.log("Connected to DB")
    } catch (err) {
        console.log(err)
    }
}
const PORT = process.argv[2] || 4500
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Learning Swagger",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:4500"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

//openAPI spcification
const openAPIspec = swaggerJSdoc(options)


//build the swaggerUI
app.use("/docs", swaggerUI.serve, swaggerUI.setup(openAPIspec))


app.use("/users", userRouter)

app.get("/regenerateToken", (req, res) => {
    const rToken = req.headers.authorization?.split(" ")[1]
    const decoded = jwt.verify(rToken, process.env.secret)
    if (decoded) {
        const token = jwt.sign({ course: "backend" }, process.env.secret, { expiresIn: "7d" })
        res.send(token)

    } else {
        res.send("Invalid refresh token")
    }
})



app.listen(PORT, () => {
    connection()
    console.log(`Connected to DB on ${PORT}`)
})