import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

interface PaymentRecord {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private payments: PaymentRecord[] = [];
  constructor(private config: ConfigService) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCheckoutSession(orderId: string, amount: number) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'saimun product',
              description: 'saimun product',
              images: [
                'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg',
              ],
            },
            unit_amount: 100 * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success?orderId=${orderId}`,
      cancel_url: 'http://localhost:5173/cancel',
      metadata: { orderId },
    });

    return session.url;
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        this.payments.push({
          orderId: session.metadata.orderId,
          amount: session.amount_total / 100,
          currency: session.currency,
          status: 'paid',
          createdAt: new Date(),
        });
        console.log('✅ Payment recorded:', event.data.object);
        break;
    }
  }
}
