const express = require("express");
const { HotelModel } = require("../model/hotels.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/auth")
const hotelRoute = express.Router();

hotelRoute.use(auth);


hotelRouter.post("/add", async (req, res) => {
    try {
        const payload = req.body;
        const hotel = await HotelModel(payload);
        await hotel.save();
        res.status(200).json({ msg: "new hotel is registered" });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

hotelRoute.get("/hotels/:id", async (req, res) => {
    const { id } = req.params.id;
    try {
        const hotel = await hotel.findOne({ _id: id }, req.body)
        if (hotel) {
            res.status(200).send(hotel);
        } else {
            res.status(400).json({ msg: "not found" });
        }
    } catch (err) {
        res.status(400).json({ error: err })
    }

});

hotelRoute.patch("/update/:id", async (req, res) => {
    const { id } = req.params.id;
    const ownerIDdocs = req.body.ownerID;
    try {
        const hotel = await HotelModel.find({ _id: id })
        const hotelIDdocs = hotel.ownerID

        if (hotelIDdocs == ownerIDdocs) {
            await HotelModel.findByIdAndUpdate({ _id: id }, req.body);
            res.status(200).json({ msg: "hotel data updated" })
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }

});

hotelRoute.delete("/del/:id", async (req, res) => {
    const { id } = req.params.id;
    const ownerIDdocs = req.body.ownerID;
    try {
        const hotel = await HotelModel.find({ _id: id })
        const hotelIDdocs = hotel.ownerID

        if (hotelIDdocs == ownerIDdocs) {
            await HotelModel.findByIdAndDelete({ _id: id }, req.body);
            res.status(200).json({ msg: "hotel data deleted" })
        }
    } catch (err) {
        res.status(400).json({ error: err });
    }
});
module.exports = {
    hotelRoute,
};