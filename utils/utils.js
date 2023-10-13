import jsonwebtoken from "jsonwebtoken";
import mysql from 'mysql2';
import config from '../config.json' assert { type: 'json' };

export function checkToken(req, res, next) {
    let token = req.cookies.token;
    if (!token)
        return res.redirect("/login");
    jsonwebtoken.verify(token, "securepass", (err, decoded) => {
        if (err) {
            res.status(403).clearCookie('token').redirect("/login");
            return;
        }
        req.user = decoded;
        next();
    });
}

export function connectToDatabase() {
    const db = mysql.createConnection(config.db);
    db.connect((err) => {
        if (err) return console.error("Error: " + err.message);
    });
    return db;
}
