const express = require('express');
const jwt = require('jsonwebtoken');
const orderRouter = express.Router();
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const secretKey = "MySuperSecretKey113";

// Middleware xác thực JWT
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.error('JWT verification failed', err);
        return res.status(403).json({ error: 'Invalid token' });
      }

      req.employeeId = decodedToken.employeeId;
      req.role = decodedToken.role;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}



// Lấy danh sách đơn hàng
orderRouter.get('/orders', authenticateJWT, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Failed to get orders', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});


// Lấy danh sách đơn hàng dựa trên ID khách hàng
orderRouter.get('/getOrderCustomer/:customerId', authenticateJWT, async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await Order.find({ customer: customerId });
    res.json(orders);
  } catch (error) {
    console.error('Failed to get orders', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});


// Lấy chi tiết đơn hàng dựa trên ID đơn hàng
orderRouter.get('/getorders/:orderId', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderDetails = await OrderDetail.find({ order: orderId });
    res.json(orderDetails);
  } catch (error) {
    console.error('Failed to get order details', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
});

// Thêm đơn hàng mới
orderRouter.post('/orders', authenticateJWT, async (req, res) => {
  const { customer,employee, orderDate, deliveryDate, totalAmount, prepaidAmount, remainingAmount } = req.body;
  const order = new Order({ customer,employee, orderDate, deliveryDate, totalAmount, prepaidAmount, remainingAmount });

  try {
    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (error) {
    console.error('Failed to create order', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Cập nhật thông tin đơn hàng
orderRouter.put('/orders/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { customer,employee, orderDate, deliveryDate, totalAmount, prepaidAmount, remainingAmount } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { customer,employee, orderDate, deliveryDate, totalAmount, prepaidAmount, remainingAmount },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Xóa đơn hàng
orderRouter.delete('/orders/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await Order.findByIdAndRemove(id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = orderRouter;
