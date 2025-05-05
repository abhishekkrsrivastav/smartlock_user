import jwt from 'jsonwebtoken';

export const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    req.user = decoded; // { id, userType }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token"
    });
  }
};


