// This function receives the roles that are allowed to access a route
// Example: authorizeRoles("Admin")
const authorizeRoles = (...roles) => {

  // This returns the actual middleware function
  // req = request, res = response, next = move to the next middleware/route
  return (req, res, next) => {

    // req.user is added by authMiddleware after the JWT is verified
    // Here we check whether the logged-in user's role is allowed
    if (!roles.includes(req.user.role)) {

      // If the user's role is not allowed, send 403 Forbidden
      return res.status(403).json({
        success: false,
        message: "Access Forbidden. You do not have permission.",
      });
    }

    // If the user's role is allowed, continue to the next middleware/route
    next();
  };
};

// Export this function so it can be used in route files
module.exports = authorizeRoles;