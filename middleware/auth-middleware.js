const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token found. Access denied",
    });
  }

  //decode token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.userInfo = decodedToken;
    next();
    
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong, try again",
    });
  }
};

module.exports = authMiddleware;
