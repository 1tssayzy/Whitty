const jwt = require("jsonwebtoken");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const handleUnauthorized = () => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/auth")) {
      return res.status(401).json({ message: "Not authorized" });
    } else {
      return res.redirect("/login");
    }
  };
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        handleUnauthorized();
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    handleUnauthorized();
  }
};
module.exports = { requireAuth };
