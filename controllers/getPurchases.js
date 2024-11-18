const Purchase = require('../models/Purchase');
const redisClient = require('../redisClient'); // Import Redis client
exports.getUserPurchases = async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: 'Missing userEmail' });
  }

  try {

      const cacheKey = `purchases:${userEmail}`;
      
      // Check if data exists in Redis cache
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('Serving from Redis cache');
        return res.json(JSON.parse(cachedData));
      }

    const purchases = await Purchase.find({ userEmail }).lean();
     // Cache the result in Redis for 1 hour (3600 seconds)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(purchases));
    console.log('Serving from MongoDB and caching the result');
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Error fetching purchases' });
  }
};
