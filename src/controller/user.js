const mongoose = require("mongoose");
const userModel = require('../model/user');
const tokenLib = require("../libs/tokenLib");
const passwordLib = require("../libs/passwordLib");
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetails = await userModel.findOne({email});
    if(checkLib.isEmpty(userDetails)){
      const apiResponse = responseLib.generate(false,"email not registered",{});
      return res.staus(200).send(apiResponse);
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
    const apiResponse =await responseLib.generate(false, err.message, {});
    res.status(500).send(apiResponse);
  }
};

//Registration
const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      const apiResponse = responseLib.generate(false, "This email is already registered", {});
      return res.status(200).send(apiResponse);
    }

    const userId = generateRandomId();
    let newUser = new userModel({
      userId: userId,
      name: name,
      password: await passwordLib.hash(password),
      email: email,
      address: address
    });

    await newUser.save();

    // Prepare the data to send to the services
    const userData = {
      userId,
      name,
      email,
      address
    };

    // Define the service URLs
    const service1Url = 'https://render-server-1oni.onrender.com/register';
    const service2Url = 'http://65.2.177.95:5001/register';

    // Make the axios calls
    const service1Request = axios.post(service1Url, userData);
    const service2Request = axios.post(service2Url, userData);

    await Promise.all([service1Request, service2Request]);

    const apiResponse = { success: true, message: "User Registered Successfully", userId };
    res.status(200).send(apiResponse);
  } catch (err) {
    const apiResponse = responseLib.generate(false, err.message, null);
    res.status(500).send(apiResponse);
  }
};




module.exports = {
  login: login,
  register: register
};
