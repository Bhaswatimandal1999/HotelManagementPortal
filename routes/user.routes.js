const express = require("express")
const { UserModel } = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { auth } = require("../middleware/auth.middleware")
const { blacklist } = require("../blacklist")

const userRouter = express.Router()



/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: It will have auto generated mongo ID
 *              owner_name:
 *                  type: string
 *                  description: The user name
 *              email:
 *                  type: string
 *                  description: The user name
 *              password:
 *                  type: string
 *                  description: The user name
 *              phone:
 *                  type: integer
 *                  description: The user name
 *              age:
 *                  type: integer
 *                  description: The user's city
 *              city:
 *                  type: string
 *                  description: The user's age
 */




/**
 * @swagger
 * tags:
 *  namer: Users
 *  description: All the API routes related to User
 */






/**
 * @swagger
 * /users/signup:
 *  post:
 *      summary: To post the details of a new user
 *      tags: [Users]
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *              schema:
 *                  $ref:"#components/schemas/User"
 *      responses:
 *      200:
 *          description: The user was successfully created
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref:"#components/schemas/user"
 *      500:
 *          description: Some server error
 */

userRouter.post("/signup", async (req, res) => {
    const { owner_name, email, password, phone, age, city } = req.body
    try {
        let user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({ msg: "user already exist" })
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                res.status(400).json({ error: err.message })
            } else {
                const user = new UserModel({ owner_name, email, password: hash, phone, age, city })
                await user.save()
                res.status(200).json({ msg: "A new user has been added", user: user })
            }
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.find({ email })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    var token = jwt.sign({ course: "backend" }, process.env.secret, { expiresIn: "7d" })
                    var rToken = jwt.sign({ course: "backend" }, process.env.secret, { expiresIn: "15d" })
                    res.status(200).json({ msg: "Login Successfull" })
                } else {
                    res.status(200).json({ msg: "Wrong Credentials" })
                }
            })
        } else {
            res.status(200).json({ msg: "User not found" })
        }
    }
    catch (err) {
        res.status(400).json({ err: err.message })
    }

})




userRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]
    try {
        blacklist.push(token)
        res.status(200).json({ msg: "The user has logged out" })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
})

module.exports = {
    userRouter
}
