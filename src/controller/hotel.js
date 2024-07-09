const mongoose = require("mongoose");
const axios = require('axios');
const hotelModel = require('../model/hotel');
const userHotelMappingModel = require("../model/userHotelMapping");
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");

const addHotel = async (req, res) => {
  try {
    const { hotelName, rating, price } = req.body;
    const hotelId = generateRandomId();
    const newHotel = new hotelModel({
      hotelId,
      hotelName,
      rating,
      price
    });
    await newHotel.save();

    // Making axios calls to the two services[ render-server and aws-server ]
    const hotelData = { hotelId, hotelName, rating, price };
    
    const service1Url = 'https://render-server-1oni.onrender.com/add-hotel';
    const service2Url = 'http://13.127.17.195:5001/add-hotel';
    try {
      const service1Response = await axios.post(service1Url,hotelData);
      console.log("Render server response:", service1Response.data);
    } catch (err) {
      console.error("Error with render server:", err.message);
    }

    try {
      const service2Response = await axios.post(service2Url,hotelData);
      console.log("AWS server response:", service2Response.data);
    } catch (err) {
      console.error("Error with AWS server:", err.message);
    }

   // await Promise.all([service1Request, service2Request]);

    const apiResponse = responseLib.generate(true, "Hotel added successfully", {});
    res.status(200).send(apiResponse);
  } catch (err) {
    const apiResponse = responseLib.generate(false, err.message, {});
    res.status(500).send(apiResponse);
  }
};



// Book hotel by its id
const bookHotel = async (req, res) => {
  try {
    const { userId, hotelId, checkIn, checkOut, guests } = req.body;
    const hotel = await hotelModel.findOne({ hotelId, isAvailable: true });
    let message;
    let bookingId = "";

    if (hotel) {
      hotel.isAvailable = false;
      await hotel.save();

      bookingId = common.generateRandomId();
      const userHotelMapping = new userHotelMappingModel({
        bookingId,
        userId,
        hotelId,
        bookingDate: Date.now(),
        checkIn,
        checkOut,
        guests
      });
      await userHotelMapping.save();
      message = "Hotel Booked successfully";

      // Prepare the data to send to the services
      const bookingData = {
        bookingId,
        userId,
        hotelId,
        checkIn,
        checkOut,
        guests
      };

       // Making axios calls to the two services[ render-server and aws-server ]
      const service1Url = 'https://render-server-1oni.onrender.com/book-hotel';
      const service2Url = 'http://13.127.17.195:5001/book-hotel';

      // Make the axios calls
      try {
        const service1Response = await axios.post(service1Url);
        console.log("Render server response:", service1Response.data);
      } catch (err) {
        console.error("Error with render server:", err.message);
      }
  
      try {
        const service2Response = await axios.post(service2Url);
        console.log("AWS server response:", service2Response.data);
      } catch (err) {
        console.error("Error with AWS server:", err.message);
      }
      //await Promise.all([service1Request, service2Request]);

    } else {
      message = "Hotel not available";
      data = {};
    }
    const apiResponse = { success: true, message, bookingId };
    res.status(200).send(apiResponse);
  } catch (err) {
    const apiResponse = responseLib.generate(false, err.message, {});
    res.status(500).send(apiResponse);
  }
};

// Get all the available hotels
const getAvailableHotels = async (req, res) => {
  try {
    const response = await axios.get('https://render-server-1oni.onrender.com/get-hotel');
    console.log("response:", response);
    const hotels = response.data.hotels;

    const message = hotels.length > 0 ? "Available hotels are following" : "No hotel available";
    const apiResponse = { success: true, message, hotels };
    
    res.status(200).send(apiResponse);
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    const apiResponse = { success: false, message: error.message, hotels: [] };
    res.status(500).send(apiResponse);
  }
};



function generateRandomId() {
  let min = 10000; // minimum value (inclusive)
  let max = 99999; // maximum value (inclusive)

  // Generate a random number between min and max
  let randomId = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomId;
}


module.exports = {
  addHotel:addHotel,
  bookHotel:bookHotel,
  getAvailableHotels:getAvailableHotels
};
