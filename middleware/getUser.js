const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.header('auth-token');
    // if token is not present
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
    // if token is present
    try {
        // verify the token
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        // if token is not valid
        res.status(401).json({ error: "Please authenticate using a valid token" });
    }
}