const SellerModel = require("../models/sellerModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidPhoneNo = /^\+?([6-9]{1})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/
const isValidPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/
const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/


// ============================================CREATE SELLER===============================================

const createSeller = async (req, res) => {
  try {
    const data = req.body

    if (Object.keys(data).length === 0) return res.status(400).send({ status: true, message: "Please Provide Seller data in body" })
    let { name, email, password, phone } = data

    if (!isValid(name)) {
      res.status(400).send({ status: false, message: 'please provide Seller Name' })
      return
    }

    if (!isValid(email)) {
      res.status(400).send({ status: false, message: 'please provide Email ID' })
      return
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, message: 'please provide password' })
      return
    }
    if (!isValid(phone)) {
      res.status(400).send({ status: false, message: 'please provide Phone No.' })
      return
    }
    if (!(isValidEmail.test(email))) {
      res.status(400).send({ status: false, message: 'please provide valid Email ID' })
      return
    }
    if (!(isValidPassword.test(password))) {
      res.status(400).send({ status: false, message: 'please provide valid password(minLength=8 , maxLength=15)' })
      return
    }
    if (!(isValidPhoneNo.test(phone))) {
      res.status(400).send({ status: false, message: 'please provide valid Phone No.' })
      return
    }
    const isEmailPresent = await SellerModel.findOne({ email: email })
    if (isEmailPresent) {
      res.status(400).send({ status: false, message: "This  is email already in use,please provide another email" })
      return
    }
    const isPhonePresent = await SellerModel.findOne({ email: email })
    if (isPhonePresent) {
      res.status(400).send({ status: false, message: "This  is phone no. already in use,please provide another Phone no." })
      return
    }
    const salt = bcrypt.genSaltSync(10);
    const encryptedPass = await bcrypt.hash(password, salt);


    const finalData = {
      "name":name,
      "email": email,
      "password": encryptedPass,
      "phone":phone
    }

    const createdSeller = await SellerModel.create(finalData)
    res.status(201).send({ status: true, message: "Seller created successfully", data: createdSeller })


  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

// ============================================LOGIN SELLER===============================================

const loginSeller = async (req, res) => {
  try {
    const data = req.body
    let { email, password } = data

    if (!Object.keys(data).length > 0) return res.status(400).send({ status: true, message: "Please Provide email and password" })

    const isEmailPresent = await SellerModel.findOne({ email: email })
    if (!isEmailPresent) {
      res.status(400).send({ status: false, message: "Email Id not exist" })
      return
    }
    if (!isValid(email)) {
      res.status(400).send({ status: false, message: 'please provide Email ID' })
      return
    }
    if (!isValid(password)) {
      res.status(400).send({ status: false, message: 'please provide password' })
      return
    }
    if (!(isValidEmail.test(email))) {
      res.status(400).send({ status: false, message: 'please provide valid Email ID' })
      return
    }
    if (!(isValidPassword.test(password))) {
      res.status(400).send({ status: false, message: 'please provide valid password(minLength=8 , maxLength=15)' })
      return
    }

    bcrypt.compare(password, isEmailPresent.password, function (err, result) {
      if (result) {
        console.log("Password matched")
        let token = jwt.sign(
          {
            sellerId: isEmailPresent._id.toString(),

          },
          "product-app",
          { expiresIn: "59m" })

        const sellerData = {
          sellerId: isEmailPresent._id,
          token: token
        }

        res.status(201).send({ status: true, message: "Seller login successfull", data: sellerData });
      }
      else {
        res.status(401).send({ status: false, message: "Plz provide correct password" });
        return;
      }
    });

  } catch (err) {
    res.status(500).send({ status: false.valueOf, message: err.message })
  }
}

module.exports = { createSeller, loginSeller }