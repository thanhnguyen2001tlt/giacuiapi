const express = require('express');
const serviceRouter = express.Router();
const Service = require('../models/service');

// Lấy danh sách dịch vụ
serviceRouter.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Failed to get services', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// Thêm dịch vụ mới
serviceRouter.post('/services', async (req, res) => {
  const { name, image, price } = req.body;
  const service = new Service({ name, image, price });

  try {
    const savedService = await service.save();
    res.json(savedService);
  } catch (error) {
    console.error('Failed to create service', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Cập nhật thông tin dịch vụ
serviceRouter.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, image, price },
      { new: true }
    );
    res.json(updatedService);
  } catch (error) {
    console.error('Failed to update service', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Xóa dịch vụ
serviceRouter.delete('/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Service.findByIdAndRemove(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = serviceRouter;
