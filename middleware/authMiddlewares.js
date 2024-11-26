const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(" ")[1]; // Optional chaining to prevent crashing if 'authorization' is undefined
        if (!token) {
            return res.status(401).send({
                message: 'Auth token missing',
                success: false
            });
        }
    
        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(200).send({
                    message: 'Auth failed',
                    success: false
                });
            } else {
                req.body.userId = decode.id; // Corrected assignment
                next(); 
            }
        });
    } catch (error) {
        console.log(error)
        res.status(401).send({
            message: 'Auth failed',
            success: false
        })
    }
};
