const Purchase = require('../models/Purchase');

exports.getUserPurchases = async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: 'Missing userEmail' });
  }

  try {
    const purchases = await Purchase.find({ userEmail });
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Error fetching purchases' });
  }
};
