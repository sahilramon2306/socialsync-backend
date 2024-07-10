const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userHotelMappingSchema = new Schema({
  bookingId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  hotelId: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String,
  },
  checkIn: {
    type:String,
    required: true
  },
  checkOut: {
    type: String,
    required: true
  },
  guests: {
    type: Number
  }
});

module.exports = mongoose.model('userHotelMapping', userHotelMappingSchema);
