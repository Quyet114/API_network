const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is not valid' });
    }

    try {
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid' });
            }
            console.log('Authenticated user:', user);
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticateUser;
