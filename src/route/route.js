const express = require("express");
const sellerMid = require("../middlewares/sellerMiddleware");   //Only for products routes
// const mongoose = require("mongoose")
const router = express.Router();


const CustomerController = require("../controllers/customerController");
const SellerController = require("../controllers/sellerController");
const ProductController = require("../controllers/productController");

router.post("/createCustomer",CustomerController.createCustomer)
router.post("/loginCustomer",CustomerController.loginCustomer)

router.post("/createSeller",SellerController.createSeller)
router.post("/loginSeller",SellerController.loginSeller)

router.post("/createProduct",ProductController.createProduct)
router.get("/getProductByQuery",ProductController.getProductByQuery)
router.get("/getProductByParams",ProductController.getProductByParams)
router.put("/updateProduct",ProductController.updateProduct)
router.delete("/deleteProduct",ProductController.deleteProduct)




module.exports = router;