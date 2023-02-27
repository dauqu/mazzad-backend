const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const db = admin.firestore();
const userRef = db.collection("users");

async function getAuthUser(req, res, next){
    try {
        const token = req.headers["x-access-token"] || req.cookies.token;

        if(!token) return res.status(401).json({
            message: "Unauthorized",
        });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        
        const user = await userRef.doc(decoded.id).get();
        let datauser = {
            id: user.id,
            ...user.data()
        };

        delete datauser.password;

        req.user = datauser;
        next();

    } catch (error) {
        return res.status(500).json({     
            message: error.message,
            error: error.code
        });
    }
}

module.exports = {getAuthUser};