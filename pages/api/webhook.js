import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';

const endpointSecret = "whsec_09f0cd90574c50bef83b6847a03d776d7d4e8780e281e1069e7b9158f61fe1ad";

export default async function handler(req, res) {
    await mongooseConnect();

    const sig = req.headers['stripe-signature'];

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
      console.log("triggered event");
    } catch (err) {
      console.error('Webhook Error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('successfully triggered');
        const data = event.data.object;
        console.log(data);
        const orderId = data.metadata.orderId;
        console.log(data.metadata.orderId);
        const paid = data.payment_status === 'paid';
        if (orderId && paid) {  
          try {
            const result = await Order.findByIdAndUpdate(orderId, {
              paid: true,
            });
            console.log('Order Update Result:', result);
          } catch (updateError) {
            console.error('Order Update Error:', updateError.message);
            res.status(500).send('Error updating order');
            return;
          }
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send('ok');
}

export const config = {
    api: {bodyParser: false,}
}