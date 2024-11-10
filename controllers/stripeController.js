// Import User model
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // Assuming you have a Purchase model

const Stripe = require('stripe');
const stripe = Stripe("sk_test_51QFnlHKaDpnPRyI3PdM05AAXLK7cvFlvCz8CuoeHaOEHiMijMwKJZ7mWJhhuHN36lzqFl2DkGNpJK5S8LDQ6mQpq00OOgREXjP");
exports.createCheckoutSession = async (req, res) => {
  const { templateId, templatePrice } = req.body;
  console.log("hlo pinki");
  console.log(templateId);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Template Purchase - ${templateId}`,
            },
            unit_amount: templatePrice * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success?templateId=${templateId}`,
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to save purchase details
exports.savePurchase = async (req, res) => {
  const { templateName, userEmail } = req.body;
 console.log("template selected successfully");
 if (!templateName || !userEmail) {
  return res.status(400).json({ message: 'Missing templateName or userEmail' });
}

  try {
    // Save the purchase details in the database
    const purchase = new Purchase({
      templateName,
      userEmail,
      date: new Date(),
    });

    await purchase.save();
    res.status(200).json({ message: 'Purchase saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving purchase details' });
  }
};

