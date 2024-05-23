const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");


const auth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(' ')[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await Users.findOne({ _id: decoded.id });

    if (!user) return res.status(400).json({ msg: "Xác thực không hợp lệ2." });

    res.locals.idUser = decoded;
    res.locals.isAdmin = user.isAdmin;
    
    next();
} catch (err) {
    return res.status(500).json({ msg: err.message });
}
};

module.exports = auth;
