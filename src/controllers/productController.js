const ProductModel = require("../models/productModel")
const SellerModel = require("../models/sellerModel")
const jwt = require('jsonwebtoken')


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValid2 = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidPhoneNo = /^\+?([6-9]{1})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{5})$/
const isValidPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/
const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const isValidObjId = /^[0-9a-fA-F]{24}$/





// ============================================ CREATE PRODUCT ===============================================

const createProduct = async (req, res) => {
    try {
        const data = req.body
        const files = req.files
        if (!Object.keys(data).length > 0) return res.status(400).send({ status: true, message: "Please Provide product data in body" })
        let { sellerId, title, description, category, price, availableSizes } = data

        // if (files && files.length > 0) {
        //     productImageUrl = await aws.uploadFile(files[0])
        //     data.productImage = productImageUrl;
        // }
        // else { return res.status(404).send({ message: "No file found" }) }

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'please provide title' })
            return
        }
        if (!isValid(sellerId)) {
            res.status(400).send({ status: false, message: 'please provide sellerId' })
            return
        }
        if (!isValid(description)) {
            res.status(400).send({ status: false, message: 'please provide description' })
            return
        }
        if (!isValid(category)) {
            res.status(400).send({ status: false, message: 'please provide category' })
            return
        }
        if (!isValid(price)) {
            res.status(400).send({ status: false, message: 'please provide price' })
            return
        }

        if (category) {
            if (!["Electronics", "Clothing"].includes(category)) {
                return res.status(400).send({ status: false, message: "Category should be from [Electronics, Clothing]" })
            }
        }
        const isTitlePresent = await ProductModel.findOne({ title: title })
        if (isTitlePresent) {
            res.status(400).send({ status: false, message: "This title is already in use, plz provide anothor title" })
            return
        }
        if (category == "Clothing") {
            if (!isValid(availableSizes)) {
                res.status(400).send({ status: false, message: 'please provide availableSizes' })
                return
            }
            if (availableSizes) {
                if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes)) {
                    return res.status(400).send({ status: false, message: "availableSizes should be from [S, XS, M, X, L, XXL, XL]" })
                }
            }
        }
        const isSellerPresent=await SellerModel.findById({sellerId:_id})
        if (isSellerPresent) {
            res.status(404).send({ status: false, message: "This seller is not in list" })
            return
        }
        const productCreated = await ProductModel.create(data)
        res.status(201).send({ status: true, message: "Success", data: productCreated })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};


// ========================================== GET PRODUCT BY QUERY ============================================

const getProductByQuery = async (req, res) => {
    try {
        let { name, type, category, price, priceGreaterThan, priceLessThan } = req.query;
        let myObj = {};
        if (name != null) myObj.name = name;
        if (type != null) myObj.type = type;
        if (category != null) myObj.category = category;
        if (price != null) myObj.price = price;
        if (size != null) myObj.size = size;
        if (priceGreaterThan != null) myObj.priceGreaterThan = priceGreaterThan;
        if (priceLessThan != null) myObj.priceLessThan = priceLessThan;

        myObj.isDeleted = false;

        if (!Object.keys(req.query).length > 0) return res.status(400).send({ status: true, message: "Please Provide Product data in query" })

        if ("category" in myObj) {
            myObj['category'] = category
            if (category) {
                if (!["Electronics", "Clothing"].includes(category)) {
                    return res.status(400).send({ status: false, message: "Size should be from [Electronics, Clothing]" })
                }
            }
        }


        if ("name" in myObj) {
            myObj['title'] = { $regex: name }
            if (!isValid(name)) {
                res.status(400).send({ status: false, message: "Product name can't be empty" })
                return
            }
        }

        if ("priceGreaterThan" in myObj && "priceLessThan" in myObj) {
            myObj['price'] = { $gte: priceGreaterThan }
            myObj['price'] = { $lte: priceLessThan }
            const productData = await ProductModel.find(myObj)
            res.status(200).send({ status: true, message: `Product between price ${priceGreaterThan} to ${priceLessThan}`, data: productData })
            return
        }

        if ("priceGreaterThan" in myObj) {
            myObj['price'] = { $gte: priceGreaterThan }
            const productData = await ProductModel.find(myObj)
            res.status(200).send({ status: true, message: `Product greater than ${priceGreaterThan}`, data: productData })
            return
        }

        if ("priceLessThan" in myObj) {
            myObj['price'] = { $lte: priceLessThan }
            const productData = await ProductModel.find(myObj)
            res.status(200).send({ status: true, message: `Product less than ${priceLessThan}`, data: productData })
            return
        }


        const productData = await ProductModel.find(myObj)

        if (productData.length === 0) {
            res.status(404).send({ status: false, message: "Product Data not Found" })
            return
        }

        res.status(200).send({ status: true, message: "Data Found", data: productData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};


// ========================================== GET PRODUCT BY PARAMS ===========================================

const getProductByParams = async (req, res) => {
    try {
        let productId = req.params.productId
        if (!isValidObjId.test(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide valid Product" });
        }

        const isProductIdPresent = await ProductModel.findOne({ _id: productId, isDeleted: false })

        if (!isProductIdPresent) {
            res.status(404).send({ status: false, message: "Product not found with this Product Id" })
            return
        }

        res.status(200).send({ status: true, message: "Success", data: isProductIdPresent })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};


// ============================================ UPDATE  PRODUCT ===============================================

const updateProduct = async (req, res) => {
    try {
        const data = req.body
        const productImage = req.files
        let productId = req.params.productId

        let { title, description, price } = data
        if (!isValidObjId.test(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide valid Product" });
        }

        if (productImage && productImage.length > 0) {
            productImageUrl = await aws.uploadFile(productImage[0])
            data.productImage = productImageUrl;
        }


        if (!isValid2(title)) {
            res.status(400).send({ status: false, message: "Title can't be empty, please provide title" })
            return
        }

        if (!isValid2(description)) {
            res.status(400).send({ status: false, message: "Description can't be empty, please provide escription" })
            return
        }
        if (!isValid2(price)) {
            res.status(400).send({ status: false, message: "Price can't be empty, please provide price" })
            return
        }


        const isTitlePresent = await ProductModel.findOne({ title: title })
        if (isTitlePresent) {
            res.status(400).send({ status: false, message: "This title is already present, plz provide anothor title" })
            return
        }

        const isProductIdPresent = await ProductModel.findOne({ _id: productId, isDeleted: false })

        if (!isProductIdPresent) {
            res.status(404).send({ status: false, message: "Product not found with this Product Id" })
            return
        }

        // Authentication & authorization

        // if (isProductIdPresent.sellerId !== req.sellerId) {
        //         res.status(401).send({ status: false, message: "Unauthorized access! You are not authorized to update this product" });
        //         return
        // }

        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, data, { new: true })


        res.status(200).send({ status: true, message: "Product updated sucessfully", data: updatedProduct });


    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};


// ============================================ DELETE PRODUCT ===============================================

const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId
        if (!isValidObjId.test(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide valid Product" });
        }

        const isProductIdPresent = await ProductModel.findOne({ _id: productId })

        if (!isProductIdPresent) {
            res.status(404).send({ status: false, message: "Product not found with this Product Id" })
            return
        }
        if (isProductIdPresent.isDeleted === true) {
            res.status(404).send({ status: false, message: "This Product is already deleted" })
            return
        }

        // Authentication & authorization

        // if (isProductIdPresent.sellerId !== req.sellerId) {
        //         res.status(401).send({ status: false, message: "Unauthorized access! You are not authorized to delete this product" });
        //         return
        // }

        const productDeleted = await ProductModel.findByIdAndUpdate({ _id: productId }, { isDeleted: true }, { new: true })
        res.status(200).send({ status: true, message: "Product deleted Succefully", data: productDeleted })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

module.exports = {
    createProduct,
    getProductByQuery,
    getProductByParams,
    updateProduct,
    deleteProduct,
};