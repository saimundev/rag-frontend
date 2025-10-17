import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/auth/public.decorator';

@Controller('payments')
export class PaymentController {
  private stripe: Stripe;

  constructor(
    private paymentService: PaymentService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(
      config.get<string>('STRIPE_SECRET_KEY')! as string,
      {
        apiVersion: '2025-09-30.clover',
      },
    );
  }

  @Public()
  @Post()
  async checkout(
    @Body() body: { orderId: string; amount: number },
    @Res() res: Response,
  ) {
    const url = await this.paymentService.createCheckoutSession(
      body.orderId,
      body.amount,
    );
    return res.json({ url });
  }

  @Public()
  @Post('webhook')
  async webhook(@Req() req: any, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];
    const secret = this.config.get('STRIPE_WEBHOOK_SECRET');
    console.log('hit this');
    console.log('req ===============>', req.rawBody);
    console.log("body =============>", req);
    console.log('header ===========>', req.headers['stripe-signature']);
    console.log('secret ==============>', secret);

    let event: Stripe.Event;
    try {
      const payload = req.rawBody;
      event = this.stripe.webhooks.constructEvent(payload, sig, secret);
      console.log('✅ Verified event:', event.type);

      // Handle the event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('💰 Payment successful:', session);
      }

      res.status(HttpStatus.OK).send();
    } catch (err) {
      console.error('❌ Webhook error:', err);
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
  }
}
