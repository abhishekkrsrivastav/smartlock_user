import db from "../config/db.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    const [blacklisted] = await db.query("SELECT * FROM token_blacklist WHERE token = ?", [token]);

    if (blacklisted.length > 0) {
        return res.status(403).send({ success: false, message: "Please login again" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        const [blacklisted] = await db.query("SELECT * FROM token_blacklist WHERE token = ?", [token]);
        if (blacklisted.length > 0) {
            return res.status(403).send({ success: false, message: "Please login again" });
        }
        
        next();
    } catch (error) {
        return res.status(401).send({ success: false, message: "Invalid token" });
    }
};

 
// export function verifyAdmin(req, res, next) {
//     if (req.session && req.session.user) {
//         next(); // Admin hai to aage badho
//     } else {
//         res.status(403).send("Access Denied! Only Admin can access this page."); // Unauthorized user ke liye error
//     }
// }


