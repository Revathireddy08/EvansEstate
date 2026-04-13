// import { errorHandler } from "./error.js";
// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   console.log("req.cookies:", req.cookies); // Debugging line
//   const token = req.cookies.access_token;
  
//   if (!token) {
//     return next(errorHandler(401, "Unauthorized"));
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandler(403, "Forbidden"));

//     req.user = user;
//     next();
//   });
// };



import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

  
  // Try to get token from cookies first
  let token = req.cookies?.access_token;
  
  // If no token in cookies, try Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);

    }
  }
  
  
  
  if (!token) {
    console.log("No token found");
    return next(errorHandler(401, "Unauthorized - No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      
      return next(errorHandler(403, "Forbidden - Invalid token"));
    }

    
    req.user = user;
    next();
  });
};