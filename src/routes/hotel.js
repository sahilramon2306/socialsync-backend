const hotelController = require("../controller/hotel");
const auth=require('../middleware/auth')
const validator=require('../middleware/validator')

//set Rotes for User routers
const setRouter=(app)=>{
    
    app.post(`/add-hotel`,auth.isAuthorized,validator.addHotelValidate,hotelController.addHotel);
    app.post(`/book-hotel`,auth.isAuthorized,hotelController.bookHotel);
    app.get(`/get-hotel`,auth.isAuthorized,hotelController.getAvailableHotels);
       
}

module.exports={
    setRouter:setRouter
}