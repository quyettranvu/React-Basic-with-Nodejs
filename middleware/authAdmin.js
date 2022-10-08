import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send("Access denied. Not authenticated...");
    try {
      const jwtSecretKey = process.env.JWTPRIVATEKEY;
      const decoded = jwt.verify(token, jwtSecretKey);
  
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send("Invalid auth token...");
    }
};

// For Admin
const isAdmin = (req, res, next) => {
    auth(req, res, () => {
      if (req.user.role===1) {
        next();
      } else {
        res.status(403).send("Access denied. Not authorized...");
      }
    });
  };

export {isAuth,isAdmin};