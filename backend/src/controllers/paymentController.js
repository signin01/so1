const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class PaymentController {
    // Create order
    static async createOrder(req, res) {
        try {
            const { amount, currency = 'INR' } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid amount'
                });
            }

            const options = {
                amount: Math.round(amount * 100),
                currency: currency,
                receipt: 'order_' + Date.now(),
                payment_capture: 1
            };

            const order = await razorpay.orders.create(options);
            res.json({
                success: true,
                orderId: order.id,
                amount: order.amount / 100,
                currency: order.currency
            });
        } catch (error) {
            console.error('Razorpay error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to create order' 
            });
        }
    }

    // Verify payment
    static async verifyPayment(req, res) {
        try {
            const { orderId, paymentId, signature } = req.body;

            if (!orderId || !paymentId || !signature) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const body = orderId + '|' + paymentId;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature === signature) {
                res.json({ 
                    success: true, 
                    message: 'Payment verified successfully' 
                });
            } else {
                res.status(400).json({ 
                    success: false, 
                    message: 'Payment verification failed' 
                });
            }
        } catch (error) {
            console.error('Verify payment error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Verification failed' 
            });
        }
    }
}

module.exports = PaymentController;