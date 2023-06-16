const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ShoppingCart } = require("../models")
require("dotenv").config();

module.exports = {

  //post('/api/user')
  // create user
  async createUser({ body }, res) {
    const { email, password, name, phone } = body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToInsert = {
        email: email,
        password: hashedPassword,
        name: name,
        phone: phone,
    };

    let user = await User.create(userToInsert);

    if (!user) {
        return res.status(400).json({ message: "Unable to create user" });
    }

    // Create a new ShoppingCart
    const newCart = new ShoppingCart({ user: user._id });
    await newCart.save();

    // Add the shoppingCart to the user
    user.shoppingCart = newCart._id;
    await user.save();

    const token = jwt.sign(
        {
            email: user.email,
            id: user._id,
            sameSite: "none",
            secure: true,
        },
        process.env.JWT_SECRET
    );

    res.status(200).json({ _id: user._id, email: user.email, name: user.name, phone: user.phone, data: { user, token } });
},











      // Function to fetch a user's shopping cart
      //  '/:userId/cart/data
      async getUsersShoppingCartData(req, res) {
        try {
            console.log("Get shopping cart data API function firing!")
            const userId = req.params.userId;
    
            console.log(userId)
    
            // Fetch the user from the database
            let user = await User.findById(userId);
    
            // If user not found, return an error
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Check if user's email exists
            if (!user.email) {
                console.log('User email not found');
                return res.status(400).json({ message: 'User email is required' });
            }
    
            // If the user doesn't have a shopping cart, create an empty one
            if (!user.shoppingCart) {
              console.log('User does not have a shopping cart. Creating one...');
              const shoppingCart = new ShoppingCart({ books: [], user: userId }); // Include the user's id
              await shoppingCart.save();
              user.shoppingCart = shoppingCart._id;
              await user.save();
              // Fetch the user again after adding the cart
              user = await User.findById(userId).populate('shoppingCart');
            } else {
              // Fetch the user with the populated shopping cart
              user = await User.findById(userId).populate('shoppingCart');
            }
    
            if (user.shoppingCart) {
                console.log('Populated shoppingCart:', user.shoppingCart);
            } else {
                console.log('User does not have a shopping cart');
                // Send a response indicating the user doesn't have a shopping cart
                return res.json({ shoppingCart: null });
            }
    
            // Send the shopping cart in the response
            res.json({ shoppingCart: user.shoppingCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    
    
      
      
          


    //* User Token request
    //* Just for testing so I can see the user data. This will only return the userId and is only used in the userContext. 
    // 'api/user/me'
    async getCurrentUserWithToken(req, res) {
      // Extract the JWT token from the header
      const token = req.headers["auth-token"];
    
      // If no token exists, return an error
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
    
      let payload;
      try {
        // If a token does exist, verify it and get the payload
        payload = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        // If the token is invalid (for instance, if it is expired), return an error
        return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
      }
    
      // The payload should contain an ID, if it doesn't, that's an error
      if (!payload || !payload.id) {
        return res.status(401).json({ message: "Unauthorized: Invalid token, no payload" });
      }
    
      try {
        // Retrieve the user by their ID
        const user = await User.findById(payload.id).select("_id email shoppingCart").populate({ path: "shoppingCart", populate: { path: "books" } });
    
        // If no user is found, return an error
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // If a user is found, return their data
        res.json(user);
      } catch (error) {
        // If there's an error while fetching the user, return it
        console.error("Error while fetching the user: ", error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
      }
    },
    






  // the user is updated by the id
  //put('/api/user/:id')
  async updateUser({ body, params }, res) {
    // Create the userToUpdate object directly from the request body
    let userToUpdate = { ...body };
  
    // Hash the password if it is provided
    if (body.password?.length) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.password, salt);
      userToUpdate.password = hashedPassword;
    }
  
    // Remove password field from userToUpdate if no password is provided to avoid overwriting existing password
    else {
      delete userToUpdate.password;
    }
  
    const user = await User.findOneAndUpdate(
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
  
  





  //post('/api/users/auth)
  // user login
  async authUser({ body }, res) {
    // Find the user by the email address
    const user = await User.findOne({
      email: body.email
    }).populate('shoppingCart');
  
    if (!user) return res.status(400).json({ message: 'Unable to authenticate user' });
  
    // We want to verify the password & kick them out if it fails
    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Unable to authenticate user' });
  
    if (!user.shoppingCart) {
      const shoppingCart = new ShoppingCart({ user: user._id, books: [] });
      await shoppingCart.save();
      user.shoppingCart = shoppingCart._id;
      await user.save();
    }
  
    const token = jwt.sign({
      email: user.email,
      id: user._id,
    }, process.env.JWT_SECRET);
  
    res.header("auth-token", token).json({ error: null, data: { user, token }});
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
      console.log("Testing GetUserById function!")
      const dbUser = await User.findById(req.params.id)
      .populate('pets');
      console.log('getUserById', dbUser);
      res
        .status(200)
        .json(dbUser);
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
  //post('/api/user/:id/cart')
//* add to shopping cart
async addToCart(req, res) {
  const { userId } = req.params;
  const body = req.body;

  const { title, author, price, cover_i, first_publish_year, key, description } = body;

  // Find the user by the id
  const user = await User.findById(userId).populate('shoppingCart');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.shoppingCart) {
    // No shopping cart associated with the user
    return res.status(400).json({ message: 'No shopping cart associated with the user' });
  }

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

  if (!cover_i || typeof cover_i !== 'number') {
    return res.status(400).json({ message: 'Invalid or missing cover_i' });
  }

  // Check if the first_publish_year is a number or can be converted to a number
  const publishYear = Number(first_publish_year);
  if (isNaN(publishYear)) {
    return res.status(400).json({ message: 'Invalid or missing first_publish_year' });
  }

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing key' });
  }

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing description' });
  }

  // Add more checks for the remaining fields if necessary

  // Construct the book object
  const newBook = { title, author, price, cover_i, first_publish_year: publishYear, key, description };

    // Add the book to the ShoppingCart
    user.shoppingCart.books.push(newBook);

    // Save the shopping cart
    try {
      await user.shoppingCart.save();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'There was an error saving the shopping cart.' });
    }

    // Return the updated shopping cart
    res.status(200).json(user.shoppingCart);
},

  
  
  

  //* Remove Book from cart
// '/:userId/cart/remove'
async removeFromCart({ body, params }, res) {
  const { bookId } = body;

  // Data validation
  if (!bookId || typeof bookId !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing bookId' });
  }

  // Find the user by the id
  const user = await User.findById(params.userId).populate('shoppingCart');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!user.shoppingCart) {
    return res.status(400).json({ message: 'No shopping cart associated with the user' });
  }

  // Find the book in the shopping cart
  const bookIndex = user.shoppingCart.books.findIndex((book) => book._id.toString() === bookId); // changed

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found in the cart' });
  }

  // Remove the book from the ShoppingCart
  user.shoppingCart.books.splice(bookIndex, 1);

  // Save the shopping cart
  try {
    await user.shoppingCart.save();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'There was an error saving the shopping cart.' });
  }

  // Return the updated shopping cart
  res.status(200).json(user.shoppingCart);
},




// user/:userId/cart/clear'
  async clearShoppingCart(req, res) {
    try {
      // Assuming the user's id is being sent as a param in the request
      const userId = req.params.userId;

      // Fetch the user from the database and populate the 'shoppingCart' field
      const user = await User.findById(userId).populate('shoppingCart');

      // If user not found, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If the user doesn't have a shopping cart, return an error
      if (!user.shoppingCart) {
        return res.status(404).json({ message: 'No shopping cart found for user' });
      }

      // Clear the books from the ShoppingCart
      user.shoppingCart.books = [];

      // Save the ShoppingCart
      const updatedCart = await user.shoppingCart.save();

      // If the ShoppingCart is not updated, return an error
      if (!updatedCart)
        return res.status(400).json({ message: "Unable to update shopping cart" });

      // Return the ShoppingCart
      res.status(200).json(updatedCart);

    } catch (error) {
      // Log the error and send a server error status code
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },


  // '/:userId/cart/create'
  // create shopping cart
  // add shopping cart
  async createShoppingCart(req, res) {
    const { userId } = req.params;

    console.log('User ID:', userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Add this code
    if (!user.email) {
      console.log('User email not found');
      return res.status(400).json({ message: 'User email is required' });
    }

    const newShoppingCart = new ShoppingCart({ books: [], user: userId }); 
    await newShoppingCart.save();

    console.log('New Shopping Cart:', newShoppingCart);

    user.shoppingCart = newShoppingCart._id;
    await user.save();

    console.log('Updated User:', user);

    res.json({ shoppingCart: newShoppingCart });
}

  
  
}

