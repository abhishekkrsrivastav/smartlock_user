import db from '../../config/db.js'

export const createSubscriptionPlan = async (req, res) => {
    try {
        const { plan_name, token_limit, price } = req.body;

        if (!plan_name || !token_limit || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const created_by = req.user.id;

        const [result] = await db.query(`insert into subscription_plans(plan_name, token_limit, price, created_by) values (?, ?, ?, ?)`,
            [plan_name, token_limit, price, created_by]);

        res.status(201).json({
            success: true,
            message: "New Subscription Plan added successfully",
            id: result.insertId
        })

    } catch (error) {
        console.error("Error in creatingSubscription:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
}