const CustomerModel = require("../models/customerModel")
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


// ============================================CREATE CuSTOMER===============================================

const createCustomer = async (req, res) => {
  try {
    const data = req.body

    if (Object.keys(data).length === 0) return res.status(400).send({ status: true, message: "Please Provide Customer data in body" })
    let { fname, lname, email, password, phone, address } = data

    if (!isValid(fname)) {
      res.status(400).send({ status: false, message: "please provide Customer's first Name" })
      return
    }
    if (!isValid(lname)) {
      res.status(400).send({ status: false, message: "please provide Customer's last Name" })
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
    if (!isValid(address.street)) {
      res.status(400).send({ status: false, message: 'please provide street address' })
      return
    }
    if (!isValid(address.pincode)) {
      res.status(400).send({ status: false, message: 'please provide pincode address' })
      return
    }
    if (!isValid(address.city)) {
      res.status(400).send({ status: false, message: 'please provide city address' })
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
    const isEmailPresent = await CustomerModel.findOne({ email: email })
    if (isEmailPresent) {
      res.status(400).send({ status: false, message: "This  is email already in use,please provide another email" })
      return
    }
    const isPhonePresent = await CustomerModel.findOne({ email: email })
    if (isPhonePresent) {
      res.status(400).send({ status: false, message: "This  is phone no. already in use,please provide another Phone no." })
      return
    }
    const salt = bcrypt.genSaltSync(10);
    const encryptedPass = await bcrypt.hash(password, salt);


    const finalData = {
      "fname": fname,
      "lname": lname,
      "email": email,
      "password": encryptedPass,
      "phone": phone,
      "address": address
    }

    const createdCustomer = await CustomerModel.create(finalData)
    res.status(201).send({ status: true, message: "Customer created successfully", data: createdCustomer })


  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

// ============================================LOGIN  customer===============================================

const loginCustomer = async (req, res) => {
  try {
    const data = req.body
    let { email, password } = data

    if (!Object.keys(data).length > 0) return res.status(400).send({ status: true, message: "Please Provide email and password" })

    const isEmailPresent = await CustomerModel.findOne({ email: email })
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
            customerId: isEmailPresent._id.toString(),

          },
          "product-app",
          { expiresIn: "59m" })

        const customerData = {
          customerId: isEmailPresent._id,
          token: token
        }

        res.status(201).send({ status: true, message: "Custmmer login successfull", data: customerData });
      }
      else {
        res.status(401).send({ status: false, message: "Plz provide correct password" });
        return;
      }
    });

  } catch (err) {
    res.status(500).send({ status: false, message: err.message })
  }
}

module.exports = { createCustomer, loginCustomer }