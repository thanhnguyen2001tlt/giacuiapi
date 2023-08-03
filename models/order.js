const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: String,
  employee: String,
  orderDate: Date,
  deliveryDate: Date,
  totalAmount: Number,
  prepaidAmount: Number,
  remainingAmount: Number,
  
});

module.exports = mongoose.model('Order', OrderSchema);
