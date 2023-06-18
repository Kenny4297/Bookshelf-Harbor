const express = require('express');
const mongoose = require('mongoose');
const Orders = require('../models/Orders');

 // GET /api/orders/:userId
module.exports = {
    async getUserOrders(req, res) {
    try {
      const userId = req.params.userId;

      // Fetch all orders for the user from the database
      let orders = await Orders.find({ user: userId });

      // If no orders found, return an empty array
      if (!orders) {
        return res.status(200).json([]);
      }

      // Return the orders
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

    // POST /api/orders
    async createOrder(req, res){
        try {
            const { user, cartItems, total } = req.body;

            const orderToInsert = {
                user: mongoose.Types.ObjectId(user._id), 
                books: cartItems.map(item => ({
                    book: {
                        title: item.title,
                        author: item.author,
                        first_publish_year: item.first_publish_year,
                        key: item.key,
                        price: item.price,
                        subject: item.subject,
                        _id: mongoose.Types.ObjectId(item._id), 
                    },
                    quantity: item.quantity,
                })),
                total: total,
                date: new Date(), 
            };

            const newOrder = new Orders(orderToInsert);

            const savedOrder = await newOrder.save();

            res.status(201).json(savedOrder);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while creating the order.' });
        }
        }
    }

