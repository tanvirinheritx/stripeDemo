
const User = require('../models/user.model')
const stripeLog = require('../models/stripeLogs.model')
const { createCustomers,
    createCustomAccounts,
    createTokens,
    stripeCharges,
    refund,
    createSource,
    getPlanList, 
    subscriptionPlan} = require('../services/stripe')

exports.register = async (req, res, next) => {
    try {

        let reqBody = req.body

        const stripeObj = {
            email: reqBody.email,
            name: reqBody.firstName + " " + reqBody.lastName
        }
        //stripe:--
        const createCustomerStripe = await createCustomers(stripeObj)

        reqBody.customerId = createCustomerStripe.id
        let newUser = new User(reqBody)
        let UserData = await newUser.save()

        newStripeLog = new stripeLog(
            {
                logs: JSON.stringify(createCustomerStripe),
                userId: UserData._id,
                type: 'createCustomers'
            }
        )
        await newStripeLog.save()

        res.status(200).send({
            status: "success",
            message: "user register",
            error: false,
            data: UserData
        })

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}


exports.login = async (req, res, next) => {
    try {

        const reqBody = req.body
        const loginData = User.find({ email: reqBody.email }, { password: reqBody.password })

        console.log('loginData', loginData)


    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}


exports.addCard = async (req, res, next) => {
    try {
        const reqBody = req.body
        const reqCard = {
            number: reqBody.number,
            exp_month: reqBody.exp_month,
            exp_year: reqBody.exp_year,
            cvc: reqBody.cvc,
        }

        const userDetails = await User.findById(reqBody.userId)
        let tokenData = await createTokens(reqCard)

        let sourceObj = {
            tokenId: tokenData.id,
            customerId: userDetails.customerId
        }

        let sourceData = await createSource(sourceObj)

        newStripeLog = new stripeLog(
            {
                logs: JSON.stringify(sourceData),
                userId: reqBody.userId,
                type: 'createTokens'
            }
        )
        await newStripeLog.save()

        res.status(200).send({
            status: "success",
            message: "user register",
            error: false,
            tokenData: tokenData,
            data: sourceData
        })

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}



exports.charge = async (req, res, next) => {
    try {
        const reqBody = req.body


        let chargeObj = {
            amount: reqBody.amount,
            customerId: reqBody.customerId,
            //   tokenId: reqBody.tokenId,
            description: reqBody.description
        }

        let chargesData = await stripeCharges(chargeObj)
        res.status(200).send({
            status: "success",
            message: "user register",
            error: false,
            data: chargesData
        })

        // console.log(data)

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}


exports.refund = async (req, res, next) => {
    try {
        const reqBody = req.body


        let refundObj = {
            amount: reqBody.amount,
            chargeId: reqBody.chargeId
        }

        let refundData = await refund(refundObj)
        res.status(200).send({
            status: "success",
            message: "user register",
            error: false,
            data: refundData
        })

        // console.log(data)

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}


exports.updateUser = async (req, res, next) => {

    try {
        console.log("hey")
        const reqBody = req.body

        let userObj = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName
        }

        let updateUserData = await User.update({ _id: reqBody.userId }, userObj)

        res.status(200).send({
            status: "success",
            message: "user update successfully",
            error: false,
            data: updateUserData
        })

        // console.log(data)

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}


exports.getAllUsers = async (req, res, next) => {

    try {

        const allUsers = await User.aggregate([
            {
                $match: {}
            }
        ])

        res.status(200).send({
            status: "success",
            message: "user update successfully",
            error: false,
            data: allUsers
        })

        // console.log(data)

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }

}


exports.deleteUser = async (req, res, next) => {

    try {
        console.log("hey")
        const reqBody = req.body

        let userObj = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName
        }

        let updateUserData = await User.update({ _id: reqBody.userId }, { deleted_at: Date.now() })

        res.status(200).send({
            status: "success",
            message: "user update successfully",
            error: false,
            data: updateUserData
        })

        // console.log(data)

    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}

exports.planList = async (req, res, next) => {

    try {
        const list = await getPlanList()

        res.status(200).send({
            status: "success",
            message: "get plan list successfully",
            error: false,
            data: list
        })
    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}

exports.subscription = async (req, res, next) => {
    try {
        const reqBody = req.body
        const userDetails = await User.findById(reqBody.userId)

        console.log("userDetails.custemerId>>>>>>>>>>",userDetails)
        const obj = {
            customerId: userDetails.customerId,
            priceId: reqBody.priceId
        }

        const list = await subscriptionPlan(obj)

        res.status(200).send({
            status: "success",
            message: "get plan list successfully",
            error: false,
            data: list
        })
    } catch (err) {

        console.log(err)
        res.status(500).send({
            status: "faiil",
            message: "something is wrong backend",
            error: true,
            data: err
        });
    }
}