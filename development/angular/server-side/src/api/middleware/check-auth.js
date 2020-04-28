const jwt = require('jsonwebtoken');
exports.authController = (req, res, next) => {
    try {
        const token = req.headers.token.split(" ")[1];
        const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth failed"
        })
    }
}