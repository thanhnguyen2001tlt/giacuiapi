const mongoose = require('mongoose');

const OrderDetailSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  service: String,
  servicePrice: Number,
  quantity: Number,
  subtotal: Number
});


module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
