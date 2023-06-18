const express = require('express');
const mongoose = require('mongoose');
const Orders = require('../models/Orders');

 
module.exports = {
  // GET /api/orders/
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

    // POST /api/orders/
        async createOrder(req, res){
          console.log("Create order function firing!")
          try {
              const { user, books, total } = req.body;
              console.log("CreateOrder body:", req.body)
      
              const orderToInsert = {
                  user: mongoose.Types.ObjectId(user), 
                  books: books.map(item => ({
                      book: {
                          title: item.book.title,
                          author: item.book.author,
                          first_publish_year: item.book.first_publish_year,
                          key: item.book.key,
                          price: item.book.price,
                          subject: item.book.subject,
                          _id: mongoose.Types.ObjectId(item.book._id), 
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
      },

      // GET /api/orders/:userId/last
      async getLastUserOrder(req, res) {
        try {
          const userId = req.params.userId;

          // Fetch the latest order for the user from the database
          let order = await Orders.findOne({ user: userId }).sort({ date: -1 });

          // If no order found, return a not found response
          if (!order) {
            return res.status(404).json({ message: 'No orders found for this user' });
          }

          // Return the order
          res.status(200).json(order);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }
    }

