import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ sucess: true, data: products });
  } catch (error) {
    console.log("error in fetching products", error.message);
    res.status(500).json({ sucess: false, message: "server Error" });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ sucess: false, message: "please provide all fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in create product:", error.message);
    res.status(500).json({ sucess: false, message: "server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ sucess: false, message: "invalid Product Id" });
  }

  try {
    const updatedProducts = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    res.status(200).json({ sucess: true, data: updatedProducts });
  } catch (error) {
    res.status(500).json({ sucess: false, message: "server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ sucess: true, message: "product deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "product not found" });
  }
};
