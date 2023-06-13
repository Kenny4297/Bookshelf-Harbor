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
  addToCart,
  removeFromCart
} = require('../../controllers/user-controller');

// Routes
router.route('/').post(createUser).get(getAllUsers);
router.route('/auth').post(authUser);
router.route('/verify').post(verifyUser);
router.route('/:id').put(updateUser).get(getUserById).delete(deleteUser);
router.route('/:userId/cart').post(addToCart);
router.route('/:userId/cart/remove').delete(removeFromCart);
router.route('/:userId/profile').put(updateProfileImage);

module.exports = router;
