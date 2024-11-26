const express = require('express');
const { loginController, registerController, authController } = require('../controllers/userCtrl');
const validateRegister = require('../middleware/validateMiddleware'); // Validation middleware
const { validationResult } = require('express-validator');
const authMiddlewares = require('../middleware/authMiddlewares');
const validateMiddleware = require('../middleware/validateMiddleware'); // Adjust path as necessary

// Router object
const router = express.Router();

// LOGIN || POST
router.post('/login', loginController);

// REGISTER || POST
router.post(
  '/register',
  validateRegister, // Apply validation middleware
  (req, res, next) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next(); // Proceed to the controller if validation passes
  },
  registerController
);

//Auth || Post
router.post('/getUserData',authMiddlewares,authController);

router.get('/test-middleware', validateMiddleware, (req, res) => {
  res.send('Middleware executed successfully');
});

module.exports = router;
