const express = require("express");
const app = express();
const router = express.Router();
const config = require("config");


const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
    key_id: 'rzp_test_VyHtTatQ09TDsY',
    key_secret: 'S4VtyFo7eeZ9Q2ghYW6cUOUM'
})


app.post('/verification', (req, res) => {
    // do a validation
    const secret = '12345678'

    console.log(req.body)

    const crypto = require('crypto')

    const shasum = crypto.createHmac('sha256', secret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest('hex')

    console.log(digest, req.headers['x-razorpay-signature'])

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        // process it
        require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
    } else {
        // pass it
    }
    res.json({ status: 'ok' })
})


router.post('/', async (req, res) => {
    const payment_capture = 1
    const amount = req.body.amount;
    const currency = req.body.currency;

    const options = {
        amount: amount * 100,
        currency: currency,
        receipt: req.body.receipt,
        payment_capture: payment_capture,
    }

    try {
        const response = await razorpay.orders.create(options)
        res.json({
            currency: response.currency,
            amount: response.amount,
            id: response.id,
        })
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;