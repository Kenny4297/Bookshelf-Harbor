const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ShoppingCart } = require("../models");
require("dotenv").config();

module.exports = {
    //post('/api/user')
    // create user
    async createUser({ body }, res) {
        const { email, password, name, phone, address, profileImage } = body;

        // Check if the email already exists
        let userExists = await User.findOne({ email });

        if (userExists) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userToInsert = {
            email: email,
            password: hashedPassword,
            name: name,
            phone: phone,
            address: address,
            profileImage: profileImage,
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

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            profileImage: user.profileImage,
            data: { user, token },
        });
    },

    // Function to fetch a user's shopping cart
    // '/:userId/cart/data
    async getUsersShoppingCartData(req, res) {
        try {
            const userId = req.params.userId;

            // Fetch the user from the database
            let user = await User.findById(userId);

            // If user not found, return an error
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if user's email exists
            if (!user.email) {
                return res
                    .status(400)
                    .json({ message: "User email is required" });
            }

            // If the user doesn't have a shopping cart, create an empty one
            if (!user.shoppingCart) {
                const shoppingCart = new ShoppingCart({
                    books: [],
                    user: userId,
                }); // Include the user's id
                await shoppingCart.save();
                user.shoppingCart = shoppingCart._id;
                await user.save();
                // Fetch the user again after adding the cart
                user = await User.findById(userId).populate("shoppingCart");
            } else {
                // Fetch the user with the populated shopping cart
                user = await User.findById(userId).populate("shoppingCart");
            }

            if (!user.shoppingCart) {
                return res.json({ shoppingCart: null });
            }

            // Send the shopping cart in the response
            res.json({ shoppingCart: user.shoppingCart });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // 'api/user/me'
    async getCurrentUserWithToken(req, res) {
        const token = req.headers["auth-token"];

        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided" });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res
                .status(401)
                .json({
                    message: "Unauthorized: Invalid token",
                    error: error.message,
                });
        }

        if (!payload || !payload.id) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid token, no payload" });
        }

        try {
            const user = await User.findById(payload.id)
                .select("_id email shoppingCart profileImage")
                .populate({
                    path: "shoppingCart",
                    populate: { path: "books" },
                });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            console.error("Error while fetching the user: ", error); 
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    },

    // the user is updated by the id
    // put('/api/user/:id')
    async updateUser({ body, params }, res) {
        let userToUpdate = { ...body };

        delete userToUpdate.password;

        const user = await User.findOneAndUpdate(
            { _id: params.id },
            userToUpdate,
            { new: true }
        );

        if (!user)
            return res.status(400).json({ message: "Unable to update user" });

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            address: user.address,
            profileImage: user.profileImage,
        });
    },

    //post('/api/users/auth)
    // user login
    async authUser({ body }, res) {
        const user = await User.findOne({
            email: body.email,
        }).populate("shoppingCart");

        if (!user)
            return res
                .status(400)
                .json({ message: "Unable to authenticate user" });

        const isValid = await bcrypt.compare(body.password, user.password);

        if (!isValid)
            return res
                .status(400)
                .json({ message: "Unable to authenticate user" });

        if (!user.shoppingCart) {
            const shoppingCart = new ShoppingCart({
                user: user._id,
                books: [],
            });
            await shoppingCart.save();
            user.shoppingCart = shoppingCart._id;
            await user.save();
        }

        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
            },
            process.env.JWT_SECRET
        );

        res.header("auth-token", token).json({
            error: null,
            data: { user, token },
        });
    },

    //post('/api/users/verify')
    async verifyUser(req, res) {
        const token = req.headers["auth-token"];

        if (!token) return res.status(401).json({ msg: "un-authorized" });

        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
        if (!isVerified) return res.status(401).json({ msg: "un-authorized" });

        const user = await User.findById(isVerified.id);
        if (!user) return res.status(401).json({ msg: "un-authorized" });

        return res
            .status(200)
            .json({
                _id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                profileImage: user.profileImage,
            });
    },

    //get('/api/users')
    async getAllUsers(req, res) {
        try {
            const dbUser = await User.find({});
            res.status(200).json(dbUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    //get('/api/users/:id')
    async getUserById(req, res) {
        try {
            const dbUser = await User.findById(req.params.id);
            res.status(200).json(dbUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    //delete('/api/users/:id')
    async deleteUser(req, res) {
        try {
            const dbUser = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("successfully deleted: " + dbUser.name);
        } catch (error) {
            res.status(500).json(error);
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
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({
                message: "Profile image updated successfully",
                user,
            });
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

        const {
            title,
            author,
            price,
            cover_i,
            first_publish_year,
            key,
            description,
        } = body;

        const user = await User.findById(userId).populate("shoppingCart");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.shoppingCart) {
            return res
                .status(400)
                .json({ message: "No shopping cart associated with the user" });
        }

        // Data validation
        if (!title || typeof title !== "string") {
            return res
                .status(400)
                .json({ message: "Invalid or missing title" });
        }
        if (
            !author ||
            (typeof author !== "string" &&
                !(
                    Array.isArray(author) &&
                    author.every((a) => typeof a === "string")
                ))
        ) {
            return res
                .status(400)
                .json({ message: "Invalid or missing author" });
        }

        if (price === undefined || typeof price !== "number") {
            return res
                .status(400)
                .json({ message: "Invalid or missing price" });
        }

        if (!cover_i || typeof cover_i !== "number") {
            return res
                .status(400)
                .json({ message: "Invalid or missing cover_i" });
        }

        const publishYear = Number(first_publish_year);
        if (isNaN(publishYear)) {
            return res
                .status(400)
                .json({ message: "Invalid or missing first_publish_year" });
        }

        if (!key || typeof key !== "string") {
            return res.status(400).json({ message: "Invalid or missing key" });
        }

        const newBook = {
            title,
            author,
            price,
            cover_i,
            first_publish_year: publishYear,
            key,
            description: description || "",
        };

        user.shoppingCart.books.push(newBook);

        try {
            await user.shoppingCart.save();
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json({
                    message: "There was an error saving the shopping cart.",
                });
        }

        res.status(200).json(user.shoppingCart);
    },

    //* Remove Book from cart
    // '/:userId/cart/remove'
    async removeFromCart({ body, params }, res) {
        const { bookId } = body;

        if (!bookId || typeof bookId !== "string") {
            return res
                .status(400)
                .json({ message: "Invalid or missing bookId" });
        }

        const user = await User.findById(params.userId).populate(
            "shoppingCart"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.shoppingCart) {
            return res
                .status(400)
                .json({ message: "No shopping cart associated with the user" });
        }

        const bookIndex = user.shoppingCart.books.findIndex(
            (book) => book._id.toString() === bookId
        ); 

        if (bookIndex === -1) {
            return res
                .status(404)
                .json({ message: "Book not found in the cart" });
        }

        user.shoppingCart.books.splice(bookIndex, 1);

        try {
            await user.shoppingCart.save();
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: "There was an error saving the shopping cart.",
                });
        }

        res.status(200).json(user.shoppingCart);
    },

    // POST
    // user/:userId/cart/clear'
    async clearShoppingCart(req, res) {
        try {
            const userId = req.params.userId;

            const user = await User.findById(userId).populate("shoppingCart");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!user.shoppingCart) {
                return res
                    .status(404)
                    .json({ message: "No shopping cart found for user" });
            }

            user.shoppingCart.books = [];

            const updatedCart = await user.shoppingCart.save();

            if (!updatedCart)
                return res
                    .status(400)
                    .json({ message: "Unable to update shopping cart" });

            res.status(200).json(updatedCart);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    // '/:userId/cart/create'
    // create shopping cart
    // add shopping cart
    async createShoppingCart(req, res) {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.email) {
            return res.status(400).json({ message: "User email is required" });
        }

        const newShoppingCart = new ShoppingCart({ books: [], user: userId });
        await newShoppingCart.save();

        user.shoppingCart = newShoppingCart._id;
        await user.save();

        res.json({ shoppingCart: newShoppingCart });
    },
};
