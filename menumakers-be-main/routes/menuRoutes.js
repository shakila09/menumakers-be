const express = require('express');
const Menu = require('../models/Menu');

const router = express.Router();

// Create a New Menu
router.post('/menus', async (req, res) => {
  const { title, items, template, createdBy } = req.body;
  try {
    const newMenu = new Menu({ title, items, template, createdBy });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu', error });
  }
});

// Get All Menus
router.get('/menus', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error });
  }
});

// Update a Menu
router.put('/menus/:id', async (req, res) => {
  const { id } = req.params;
  const { title, items, template } = req.body;
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(id, { title, items, template }, { new: true });
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu', error });
  }
});

// Delete a Menu
router.delete('/menus/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Menu.findByIdAndDelete(id);
    res.status(200).json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu', error });
  }
});

module.exports = router;
