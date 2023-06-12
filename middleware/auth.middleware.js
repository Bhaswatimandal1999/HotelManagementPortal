const jwt = require("jsonwebtoken")
const rateLimit = require("express-rate-limit")
require("dotenv").config()


const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.secret)
            if (decoded) {
                next()
            } else {
                res.status(200).json({ msg: "Invalid Token" })
            }
        } catch (err) {
            res.status(400).json({ msg: err.message })
        }
    } else {
        res.status(400).json({ msg: "Please login" })
    }
}




const rateLimiterMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Max Request Limit Has Been Exceeded'
});




const errorHandlerMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal Server Error' });
};



module.exports = {
    auth,
    rateLimiterMiddleware,
    errorHandlerMiddleware
}