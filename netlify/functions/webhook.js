const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async ({ body, headers }) => {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = stripeEvent.data.object;
        await updateUserSubscription(subscription);
        break;
      
      case 'customer.subscription.deleted':
        const canceledSubscription = stripeEvent.data.object;
        await cancelUserSubscription(canceledSubscription);
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function updateUserSubscription(subscription) {
  const { data: user, error } = await supabase
    .from('users')
    .update({
      subscription_status: subscription.status,
      subscription_tier: subscription.items.data[0].price.lookup_key,
      subscription_id: subscription.id,
      current_period_end: new Date(subscription.current_period_end * 1000),
    })
    .eq('stripe_customer_id', subscription.customer);

  if (error) throw error;
}

async function cancelUserSubscription(subscription) {
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      subscription_tier: null,
      subscription_id: null,
      current_period_end: null,
    })
    .eq('stripe_customer_id', subscription.customer);

  if (error) throw error;
}