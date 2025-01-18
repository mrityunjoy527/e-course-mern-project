import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const isAuthenticated = async (req, res, next) => {
  try {
    await new Promise((res, rej) => {
      setTimeout(res, 1000);
    });
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({message: "User not authenticated"});
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if(!decode) {
        return res.status(401).json({message: "Invalid token"});
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal server error"});
  }
};

export {generateToken, isAuthenticated};