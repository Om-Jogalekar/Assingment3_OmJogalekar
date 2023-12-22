const Product = require('../model/product');
const User = require('../model/user');

const createProduct =  async(req,res)=>{
    try {
        const{productId , name , description , price} = req.body;
        const ownerId = req.user.userId;
        const owner = await User.findOne({_id:ownerId});
        if(!owner)
        {
            return res.status(404).json({message:'User not found'});
        }
        const product = new Product({
          productId, 
          name,
          description,
          price,
          owner:ownerId});
        await product.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        res.status(500).json({error : error.message});
    }
  }

  const getAllProduct = async(req,res)=>{
    try {
      const data = await Product.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({error : error.message});
    }
  }

  const getProductDetails = async(req,res)=>{
      try {
        const productId = req.params.productId;
        console.log(productId);
        const data  = await Product.findOne({productId:productId});
        if (!data) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({error : error.message});
      }
  }

  const updateProduct = async (req,res)=>{
    try {
      const {name,description,price} = req.body;
      const productId = req.params.productId;
      const product = await Product.findOne({productId:productId});
      if(!product)
      {
        return res.status(404).json({message:"Product Not Found"});
      }

      const isOwner = product.owner.equals(req.user.userId);
      const isAdmin  = req.user.isAdmin;

      if (isAdmin || isOwner) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        await product.save();

        res.status(200).json({ message: 'Product updated successfully' });
      } else {
        res.status(403).json({ message: 'Not authorized to update this product' });
      }
    } catch (error) {
      res.status(500).json({error : error.message});
    }
  }

  const deleteProduct = async(req,res)=>{
    try {
      const productId = req.params.productId;
      const product = await Product.findOne({productId:productId});
      if(!product)
      {
        return res.status(404).json({message : "Product not found"});
      }

      const isOwner = product.owner.equals(req.user.userId);
      const isAdmin = req.user.isAdmin;

      if(isAdmin || isOwner)
      {
        await product.deleteOne({productId:productId});
        res.status(200).json({ message: 'Product deleted successfully' });
      }
      else {
        res.status(403).json({ message: 'Not authorized to delete this product' });
      }

    } catch (error) {
      res.status(500).json({error : error.message});
    }

  }

  module.exports = {
    createProduct,
    getAllProduct,
    getProductDetails,
    updateProduct,
    deleteProduct
  }



