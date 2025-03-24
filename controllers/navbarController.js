import db from "../config/db.js";

export const getNavbar = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM navbar_items WHERE is_visible = 1 ORDER BY position ASC`);
        res.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
}