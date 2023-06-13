const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {

  //post('/api/users')
  async createUser({ body }, res) {
    const { email, password, name, phone } = body;
    // Check if the user already exists
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // the password is hashed and the salt is stored in the database
    const userToInsert = { 
      email: email,
      password: hashedPassword,
      name: name,
      phone: phone };
    // Create the user
    const user = await User.create(userToInsert);
    // if the user is not created, return an error
    if (!user)
      return res.status(400).json({ message: "Unable to create user" });

    const token = jwt.sign({
      email: user.email,
      id: user._id,
      sameSite: "none",
      secure: true,
    }, process.env.JWT_SECRET)

    // Return the user and token
    res.status(200).json({ _id: user._id, email: user.email, name: user.name, phone: user.phone, data: { user, token } });
  },

  // the user is updated by the id
  //put('/api/users/:id')
  async updateUser({ body, params }, res) {
    const { email, password, name, phone } = body;

    // Find the user by the id
    let userToUpdate = { email: email };
    // if the password is not empty, the password is hashed and the salt is stored in the database
    if (password?.length) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      // Update the user
      //is there a way to do something like the input change in react?
      //({...formData, [e.target.name]: e.target.value}) like this?
      userToUpdate = { ...userToUpdate, password: hashedPassword, name: name, phone: phone };
    }

    const user = await User.updateOne(
      // Find the user by the id
      { _id: params.id },
      userToUpdate,
      // Return the updated user
      { new: true }
    );
    // if the user is not updated, return an error
    if (!user)
      return res.status(400).json({ message: "Unable to update user" });
    // Return the user
    res.status(200).json({ _id: user._id, email: user.email, name: user.name, phone: user.phone });
  },
//post)('/api/users/auth)
  async authUser({ body }, res) {

    console.log(User)
    // Find the user by the email address
    const user = await User.findOne({
      email: body.email
    });

    if (!user) return res.status(400).json({ message: 'Unable to authenticate user' });

    // We want to verify the password & kick them out if it fails
    const isValid = await bcrypt.compare(body.password, user.password)
    if( !isValid ) return res.status(400).json({ message: 'Unable to authenticate user' });

    const token = jwt.sign({
      email: user.email,
      id: user._id,
      sameSite: "none",
      secure: true,
      

    }, process.env.JWT_SECRET)

    res.header("auth-token", token).json({ error: null, data: { user, token }})
  },
  //post('/api/users/verify')
  async verifyUser(req, res){
    const token = req.headers["auth-token"]

    if( !token ) return res.status(401).json({msg: "un-authorized"})

    const isVerified = jwt.verify(token, process.env.JWT_SECRET)
    if( !isVerified ) return res.status(401).json({msg: "un-authorized"})

    const user = await User.findById(isVerified.id)
    if( !user ) return res.status(401).json({msg: "un-authorized"})
    
    return res.status(200).json({ _id: user._id, email: user.email, name: user.name, phone: user.phone, profileImage: user.profileImage})
  },
  //get('/api/users')
    async getAllUsers(req, res) {
      try {
        const dbUser = await User.find({})
        res
          .status(200)
          .json(dbUser)
      } catch (error) {
        res
          .status(500)
          .json(error)
      }
    },

  //this is the route that is called when the user clicks on the profile button
  //get('/api/users/:id')
  async getUserById(req, res) {
    try {
      const dbUser = await User.findById(req.params.id)
      .populate('pets')
      res
        .status(200)
        .json(dbUser)
    } catch (error) {
      res
        .status(500)
        .json(error)
    }
  },

//delete('/api/users/:id')
 async deleteUser(req, res) {
    try {
      const dbUser = await User.findByIdAndDelete(req.params.id)
      res
        .status(200)
        .json('successfully deleted: ' + dbUser.name)
    } catch (error) {
      res
        .status(500)
        .json(error)
    }
  },

  async updateProfileImage(req, res) {
    const userId = req.params.userId;
    const { url } = req.body.profileImage;
  
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { profileImage: url },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

    console.log(user);
    res
      .status(200)
      .json({ message: "Profile image updated successfully", user });
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ADDING TO SHOPPING CART
  //post('/api/users/:id/cart')
  //* add to shopping cart
  async addToCart({ body, params }, res) {
    console.log('addToCart server received:', body);
    const { title, author, price, cover_id, edition_count, first_publish_year, subject } = body;
  
    // Data validation
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing title' });
    }
    if (!author || (typeof author !== 'string' && !(Array.isArray(author) && author.every(a => typeof a === 'string')))) {
      return res.status(400).json({ message: 'Invalid or missing author' });
    }

    if (price === undefined || typeof price !== 'number') {
      return res.status(400).json({ message: 'Invalid or missing price' });
    }
    // Add more checks for the remaining fields if necessary
    
    // Find the user by the id
    const user = await User.findById(params.userId);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Construct the book object
    const book = { title, author, price, cover_id, edition_count, first_publish_year, subject };
  
    // Add the book to the ShoppingCart
    user.shoppingCart.books.push(book);
  
    // Save the user
    try {
      const updatedUser = await user.save();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'There was an error saving the user.' });
    }
  
    if (!updatedUser) {
      return res.status(500).json({ message: 'Could not update user' });
    }
  
    // Return the updated user
    res.status(200).json(updatedUser);
  },

  //* Remove Book from cart
  async removeFromCart({ body, params }, res) {
    const { bookId } = body;
  
    // Data validation
    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing bookId' });
    }
  
    // Find the user by the id
    const user = await User.findById(params.userId);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Find the book in the shopping cart
    const bookIndex = user.shoppingCart.books.findIndex((book) => book._id.toString() === bookId);
  
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in the cart' });
    }
  
    // Remove the book from the ShoppingCart
    user.shoppingCart.books.splice(bookIndex, 1);
  
    // Save the user
    const updatedUser = await user.save();
  
    if (!updatedUser) {
      return res.status(500).json({ message: 'Could not update user' });
    }
  
    // Return the updated user
    res.status(200).json(updatedUser);
  }
}

