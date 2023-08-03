const express = require('express');
const ingredientRouter = express.Router();
const Ingredient = require('../models/ingredient');

// Lấy danh sách nguyên liệu
ingredientRouter.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    console.error('Failed to get ingredients', error);
    res.status(500).json({ error: 'Failed to get ingredients' });
  }
});

// Thêm nguyên liệu mới
ingredientRouter.post('/ingredients', async (req, res) => {
  const { name, date, quantity, unitPrice, total, prepaid, remaining } = req.body;
  const ingredient = new Ingredient({ name, date, quantity, unitPrice, total, prepaid, remaining });

  try {
    const savedIngredient = await ingredient.save();
    res.json(savedIngredient);
  } catch (error) {
    console.error('Failed to create ingredient', error);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// Cập nhật thông tin nguyên liệu
ingredientRouter.put('/ingredients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, quantity, unitPrice, total, prepaid, remaining } = req.body;

  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    name && (ingredient.name = name);
    date && (ingredient.date = date);
    quantity && (ingredient.quantity = quantity);
    unitPrice && (ingredient.unitPrice = unitPrice);
    total && (ingredient.total = total);
    prepaid && (ingredient.prepaid = prepaid);
    remaining && (ingredient.remaining = remaining);

    const updatedIngredient = await ingredient.save();
    res.json(updatedIngredient);
  } catch (error) {
    console.error('Failed to update ingredient', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});


// Xóa nguyên liệu
ingredientRouter.delete('/ingredients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Ingredient.findByIdAndRemove(id);
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('Failed to delete ingredient', error);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

module.exports = ingredientRouter;
