const router = require('express').Router();

// Controllers
const { 
  authUser, 
  createUser, 
  updateUser, 
  verifyUser, 
  getAllUsers,
  getUserById,
  deleteUser,
  updateProfileImage,
  getCurrentUserWithToken,
  addToCart,
  removeFromCart,
  getUsersShoppingCartData // Import the new function here
} = require('../../controllers/user-controller');

// Routes
router.route('/').post(createUser).get(getAllUsers);
router.route('/me').get(getCurrentUserWithToken);
router.route('/auth').post(authUser);
router.route('/verify').post(verifyUser);
router.route('/:id').put(updateUser).get(getUserById).delete(deleteUser);
router.route('/:userId/cart').post(addToCart);
router.route('/:userId/cart/remove').delete(removeFromCart);
router.route('/:userId/profile').put(updateProfileImage);
router.route('/:userId/cart/data').get(getUsersShoppingCartData);

module.exports = router;
