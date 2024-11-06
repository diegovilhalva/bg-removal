import { Webhook } from "svix"
import User from "../models/user.model.js"
import { Stripe } from 'stripe'
import Transaction from "../models/transaction.model.js"
const clerkWebooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case "user.created": {

                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await User.create(userData)
                res.json({})
                break;
            }
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await User.findOneAndUpdate({ clerkId: data.id }, userData)

                res.json({})

                break;
            }
            case "user.deleted": {
                await User.findOneAndUpdate({ clerkId: data.id })
                res.json({})
                break;
            }


            default:
                break;
        }

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}





const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.body

        const userData = await User.findOne({ clerkId })

        res.json({ success: true, credits: userData.creditBalance })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentStripe = async (req, res) => {
    try {
        const { clerkId, planId } = req.body;

        const userData = await User.findOne({ clerkId });

        if (!userData || !planId) {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }

        let credits, plan, amount;
        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.json({ success: false, message: 'Invalid Plan ID' });
        }

        const date = Date.now();
        const transactionData = {
            clerkId,
            plan,
            amount,
            credits,
            date,
        };

        const newTransaction = await Transaction.create(transactionData);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            metadata: {
                transactionId: newTransaction._id.toString(),
                clerkId,
                plan,
            },
        });
        res.json({ success: true, order: { clientSecret: paymentIntent.client_secret,paymentIntentId: paymentIntent.id } });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

const verifyStripe = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;


        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {

            const transactionData = await Transaction.findById(paymentIntent.metadata.transactionId);


            if (transactionData.payment) {
                return res.json({
                    success: false,
                    message: "Payment Failed",
                });
            }


            const userData = await User.findOne({ clerkId: transactionData.clerkId });
            const creditBalance = userData.creditBalance + transactionData.credits;


            await User.findByIdAndUpdate(userData._id, { creditBalance });

            
            await Transaction.findByIdAndUpdate(transactionData._id, { payment: true });

            return res.json({
                success: true,
                message: "Credits Added",
            });
        } else {
            return res.json({
                success: false,
                message: "Payment not successful",
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};





export { clerkWebooks, userCredits, paymentStripe, verifyStripe }