// Import the User model to interact with users in MongoDB
const User = require("../models/User");

// Import bcrypt to securely hash passwords and compare passwords
const bcrypt = require("bcryptjs");

// Import JWT to create login authentication tokens
const jwt = require("jsonwebtoken");

// ===============================
// Register User
// This function creates a new user account
// ===============================
const registerUser = async (req, res) => {
  try {
    // Get user details sent from the frontend
    const { name, email, phone, role, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });

    // If the email is already registered, stop the registration
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password before saving it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in MongoDB
    const user = await User.create({
      name,
      email,
      phone,
      role,
      password: hashedPassword,
    });

    // Convert the database user object into a normal JavaScript object
    const userResponse = user.toObject();

    // Remove the password before sending user data to the frontend
    delete userResponse.password;
  

    // Send successful registration response to the frontend
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    // Print the error in the backend terminal
    console.error(error);

    // Send server error response
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Login User
// This function checks the user's login details
// ===============================
const loginUser = async (req, res) => {
  try {
    // Get email and password sent from the Login page
    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    // Find the user in MongoDB using the email
    const user = await User.findOne({ email });

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, reject the login
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create a JWT token after successful login
    const token = jwt.sign(
      {
        // Store the user's ID inside the token
        id: user._id,

        // Store the user's email inside the token
        email: user.email,

        // Store the user's role inside the token
        role: user.role,
      },

      // Secret key used to sign the JWT
      process.env.JWT_SECRET,

      {
        // Token will expire after 7 days
        expiresIn: "7d",
      }
    );

    // Convert the database user object into a normal JavaScript object
    const userResponse = user.toObject();

    // Remove the password before sending user data to the frontend
    delete userResponse.password;

    // Send successful login response to the frontend
    res.status(200).json({
      success: true,
      message: "Login successful",

      // Send the JWT token to the frontend
      token,

      // Send user information without the password
      user: userResponse,
    });

  } catch (error) {
    // Print the error in the backend terminal
    console.error(error);

    // Send server error response
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Profile (Protected Route)
// This function returns information about the logged-in user
// ===============================
const getProfile = async (req, res) => {

  // Send a successful response with the logged-in user's information
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",

    // req.user is added by the authentication middleware
    loggedInUser: req.user,
  });
};

// Export these functions so the route file can use them
module.exports = {
  registerUser,
  loginUser,
  getProfile,
};