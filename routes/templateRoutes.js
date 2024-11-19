const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinaryConfig');
const Template = require('../models/Template');

router.post('/save-svg', async (req, res) => {
  const { userId, templateName, svgContent } = req.body;

  if (!userId || !templateName || !svgContent) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Upload the SVG content to Cloudinary
    const result = await cloudinary.uploader.upload(svgContent, {
      folder: `menu_maker_uploads/user_${userId}`,
      public_id: templateName,
      resource_type: 'image',
      overwrite: true,
    });

    // Upsert (update if exists, insert if not)
    const updatedTemplate = await Template.findOneAndUpdate(
      { userId, templateName },
      {
        userId,
        templateName,
        imageUrl: result.secure_url,
        previewUrl: result.secure_url,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed', error });
  }
});


// Define the route to get user templates
router.get('/user-templates', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'Missing user ID' });
  }

  try {
    // Fetch the latest version of each template for the user
    const templates = await Template.find({ userId })
      .sort({ updatedAt: -1 }) // Sort by latest update
      .lean();

    // Filter to keep only the most recent version of each templateName
    const uniqueTemplates = Object.values(
      templates.reduce((acc, template) => {
        acc[template.templateName] = template;
        return acc;
      }, {})
    );

    res.json({ success: true, templates: uniqueTemplates });
  } catch (error) {
    console.error('Error fetching user templates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch templates' });
  }
});


module.exports = router;