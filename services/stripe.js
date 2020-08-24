const { STRIPE_KEY } = require('../config/constant');

const stripe = require('stripe')(STRIPE_KEY);

exports.createCustomers = async customerObj => {
    try{
        const customer = await stripe.customers.create(customerObj);
        return customer
    } catch (err) {
        throw err
    }
}


 

exports.createCustomAccounts = async customerObj => {
    try {
        const account = await stripe.accounts.create({
            type: 'custom',
            country: 'US',
            email: 'jenny.rosen@example.com',
            capabilities: {
              card_payments: {requested: true},
              transfers: {requested: true},
            },
          });

          console.log("account........",account)

        return account

    } catch (err) {
        console.log("err>>>>>>>>>>>",err)
        throw err
    }
}

exports.createTokens = async Obj => {
    try{
        const token = await stripe.tokens.create({
            card: Obj,
          });
          return token
    } catch (err) {
        throw err
    }
}

exports.createSource = async Obj => {
    try{
        const card = await stripe.customers.createSource(
            Obj.customerId,
            {source: Obj.tokenId}
          );
          return card
    } catch (err) {
        throw err
    }
}

exports.stripeCharges = async Obj => {
    try {
        console.log("Obj.......",Obj)
        const charge = await stripe.charges.create({
            amount: Obj.amount,
            currency: 'inr',
            // source: Obj.tokenId,
            customer: Obj.customerId,
            description: Obj.description,
          });

          console.log("charge......",charge)

          return charge

    } catch (err) {
        throw err
    }
}

exports.refund = async Obj => {
    try {
        const refund = await stripe.refunds.create({
            charge: Obj.chargeId,
            amount: Obj.amount
          });

    } catch (err) {
        throw err
    }
}

exports.getPlanList = async () => {
    try {
        const plans = await stripe.plans.list({limit: 3});
        return plans

    } catch (err) {
        throw err
    }
}

exports.subscriptionPlan = async Obj => {
    try {
        const subscription = await stripe.subscriptions.create({
            customer: Obj.customerId,
            items: [
              {price: Obj.priceId},
            ],
          });

          return subscription
    } catch (err) {
        throw err
    }
}


