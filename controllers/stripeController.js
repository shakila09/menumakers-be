const Stripe = require('stripe');
const stripe = Stripe("sk_test_51QFnlHKaDpnPRyI3PdM05AAXLK7cvFlvCz8CuoeHaOEHiMijMwKJZ7mWJhhuHN36lzqFl2DkGNpJK5S8LDQ6mQpq00OOgREXjP");
exports.createCheckoutSession = async (req, res) => {
  const { templateId, templatePrice } = req.body;
  
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
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
