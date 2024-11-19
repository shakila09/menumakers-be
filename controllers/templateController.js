// templateController.js

const Template = require('../models/Template'); // Import your Template model

// Fetch the most recent version of each template for a user
const getUserTemplates = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  try {
    // Aggregation query to get the latest version of each template
    const templates = await Template.aggregate([
      { $match: { userId } },
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: "$templateName",
          latestTemplate: { $first: "$$ROOT" }
        }
      }
    ]);

    res.json({ success: true, templates: templates.map((item) => item.latestTemplate) });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ success: false, message: 'Error fetching templates' });
  }
};

module.exports = { getUserTemplates };