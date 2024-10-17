import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Product from './models/product.model.js'
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use(express.json())

app.get("/api/products",async (req,res)=>{
  try {
    const products = await Product.find({});
    res.status(200).json({sucess:true,data:products})
  } catch (error) {
    console.log("error in fetching products", error.message);
    res.status(500).json({sucess:false,message:"server Error"})
    
  }
})

app.post("/api/products", async (req, res) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return res.status(400).json({sucess:false,message: "please provide all fields"});
  }

  const newProduct = new Product(product)

  try {
    await newProduct.save();
    res.status(201).json({success: true,data: newProduct});
  } catch (error) {
    console.error("Error in create product:" , error.message);
    res.status(500).json({sucess: false,message: "server Error"})
  }
});

app.put("/api/products/:id",async (req,res)=> {
  const {id} = req.params;
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({sucess:false,message: "invalid Product Id"})
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {new:true});
    res.status(200).json({sucess: true, data:updatedProduct})
  } catch (error) {
    res.status(500).json({sucess:false , message: "server Error"});
  }
})


app.delete("/api/products/:id",async (req,res) => {
  const {id} = req.params;
  
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({sucess: true, message:"product deleted"});
  } catch (error) {
    res.status(404).json({success:false,message:"product not found"})
  }
  
})

app.listen(5000, () => {
  connectDB();
  console.log("server started at http://localhost:5000");
});
