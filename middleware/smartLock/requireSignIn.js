import jwt from 'jsonwebtoken';

export const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    req.user = decoded; // { id, userType }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token"
    });
  }
};
// export default requireSignIn;

export const checkAndDecrementTokens = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [subs] = await db.query(
      `SELECT * FROM subscriptions WHERE user_id = ? AND remaining_tokens > 0 ORDER BY end_date DESC LIMIT 1`,
      [userId]
    );

    if (subs.length === 0) {
      return res.status(403).json({ message: "No valid subscription or tokens exhausted" });
    }

    await db.query(
      `UPDATE subscriptions SET remaining_tokens = remaining_tokens - 1 WHERE id = ?`,
      [subs[0].id]
    );

    next();
  } catch (err) {
    res.status(500).json({ message: "Token check failed", error: err.message });
  }
};
export default { checkAndDecrementTokens, requireSignIn };