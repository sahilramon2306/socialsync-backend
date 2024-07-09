const mongoose = require("mongoose");
const userModel = require('../model/user');
const tokenLib = require("../libs/tokenLib");
const passwordLib = require("../libs/passwordLib");
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");
const axios = require('axios');


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetails = await userModel.findOne({email});
    if(!userDetails){
      const apiResponse = responseLib.generate(false,"email not registered",{});
      return res.status(200).send(apiResponse);
    }
    if (await passwordLib.verify(password,userDetails.password)) {
      console.log("Verified");
      let payload = {
        exp: "2 hours",
        token: await tokenLib.generateToken(userDetails),
      };
      let apiResponse = responseLib.generate(true, "Verification successfull", payload);
      res.status(200).send(apiResponse);
    } else {
      const apiResponse = responseLib.generate(false,"Incorrect password",{});
      res.status(200).send(apiResponse);
    }
  } catch (err) {
    const apiResponse = responseLib.generate(false, err.message, {});
    res.status(500).send(apiResponse);
  }
};

//Registration
const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const isUserExist = await userModel.findOne({ email });
    let hashedPassword = await passwordLib.hash(password);
    if (isUserExist) {
      const apiResponse = responseLib.generate(false, "This email is already registered", {});
      return res.status(200).send(apiResponse);
    }

    const userId = generateRandomId();
    let newUser = new userModel({
      userId: userId,
      name: name,
      password:hashedPassword,
      email: email,
      address: address
    });

    await newUser.save();

    // Prepare the data to send to the services
    const userData = {
      userId,
      name,
      password:hashedPassword,
      email,
      address
    };

    // Define the service URLs
    const service1Url = 'https://render-server-1oni.onrender.com/register';
    const service2Url = 'http://13.127.17.195:5001/register';

    try {
      const service1Response = await axios.post(service1Url, userData);
      console.log("Render server response:", service1Response.data);
    } catch (err) {
      console.error("Error with render server:", err.message);
    }

    try {
      const service2Response = await axios.post(service2Url, userData);
      console.log("AWS server response:", service2Response.data);
    } catch (err) {
      console.error("Error with AWS server:", err.message);
    }

    const apiResponse = { success: true, message: "User Registered Successfully", userId };
    res.status(200).send(apiResponse);
  } catch (err) {
    const apiResponse = responseLib.generate(false, err.message, null);
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
  login: login,
  register: register
};
