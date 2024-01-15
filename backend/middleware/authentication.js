import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if(err) {
        return res.json({ Error: "Token is not valid" });
      } else {
        req.name = decoded.name;
        req.id = decoded.id;
        next();
      }
    })
  }
}

export { verifyUser};