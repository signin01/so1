const Razorpay = require('razorpay');
const crypto = require('crypto');
const { RAZORPAY } = require('../config/env');
const logger = require('../utils/logger');

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: RAZORPAY.keyId,
            key_secret: RAZORPAY.keySecret
        });
    }

    async createOrder(amount, currency = 'INR', receipt = null) {
        try {
            const options = {
                amount: Math.round(amount * 100),
                currency,
                receipt: receipt || `order_${Date.now()}`,
                payment_capture: 1
            };

            const order = await this.razorpay.orders.create(options);
            logger.info(`Order created: ${order.id} for amount ${amount}`);
            return {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            };
        } catch (error) {
            logger.error('Razorpay order creation error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(orderId, paymentId, signature) {
        try {
            const body = orderId + '|' + paymentId;
            const expectedSignature = crypto
                .createHmac('sha256', RAZORPAY.keySecret)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature === signature) {
                logger.info(`Payment verified: ${paymentId}`);
                return {
                    success: true,
                    message: 'Payment verified successfully'
                };
            } else {
                logger.warn(`Payment verification failed: ${paymentId}`);
                return {
                    success: false,
                    message: 'Payment verification failed'
                };
            }
        } catch (error) {
            logger.error('Verify payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getPaymentDetails(paymentId) {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            return {
                success: true,
                payment
            };
        } catch (error) {
            logger.error('Get payment details error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new PaymentService();