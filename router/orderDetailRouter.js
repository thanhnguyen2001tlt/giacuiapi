const express = require('express');
const jwt = require('jsonwebtoken');
const orderDetailRouter = express.Router();
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

// Lấy danh sách chi tiết đơn hàng
orderDetailRouter.get('/orderDetails', authenticateJWT, async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find();
    res.json(orderDetails);
  } catch (error) {
    console.error('Failed to get order details', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
});
// Lấy danh sách chi tiết đơn hàng theo id
orderDetailRouter.get('/orderDetails/:orderId', authenticateJWT, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderDetails = await OrderDetail.find({ order: orderId });
    res.json(orderDetails);
  } catch (error) {
    console.error('Failed to get order details', error);
    res.status(500).json({ error: 'Failed to get order details' });
  }
});


// Thêm chi tiết đơn hàng mới
orderDetailRouter.post('/orderDetails', authenticateJWT, async (req, res) => {
  const { order, service, servicePrice, quantity, subtotal } = req.body;
  const orderDetail = new OrderDetail({ order, service, servicePrice, quantity, subtotal });

  try {
    const savedOrderDetail = await orderDetail.save();
    res.json(savedOrderDetail);
  } catch (error) {
    console.error('Failed to create order detail', error);
    res.status(500).json({ error: 'Failed to create order detail' });
  }
});

// Cập nhật thông tin chi tiết đơn hàng
orderDetailRouter.put('/orderDetails/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { order, service, servicePrice, quantity, subtotal } = req.body;

  try {
    const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
      id,
      { order, service, servicePrice, quantity, subtotal },
      { new: true }
    );
    res.json(updatedOrderDetail);
  } catch (error) {
    console.error('Failed to update order detail', error);
    res.status(500).json({ error: 'Failed to update order detail' });
  }
});

// Xóa chi tiết đơn hàng
orderDetailRouter.delete('/orderDetails/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await OrderDetail.findByIdAndRemove(id);
    res.json({ message: 'Order detail deleted successfully' });
  } catch (error) {
    console.error('Failed to delete order detail', error);
    res.status(500).json({ error: 'Failed to delete order detail' });
  }
});

module.exports = orderDetailRouter;
