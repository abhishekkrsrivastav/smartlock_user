import db from '../../config/db.js'

export const createSubscriptionPlan = async (req, res) => {
    try {
        const { plan_name, token_limit, price, validity_days } = req.body;

        if (!plan_name || !token_limit || !price || !validity_days) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (req.user.userType === 3) {
            return res.status(403).json({ error: "Customers are not allowed to create plans" });
        }

        const created_by = req.user.id;

        const [result] = await db.query(`insert into subscription_plans(plan_name, token_limit, price, validity_days, created_by) values (?, ?, ?, ?, ?)`,
            [plan_name, token_limit, price, validity_days, created_by]);

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

export const getAllSubscriptionPlans = async (req, res) => {
    try {
        const [plans] = await db.query(`SELECT * FROM subscription_plans`);
        res.status(200).json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// export const getSubscriptionPlanById = async (req, res) => {
//     const planId = req.params.id;

//     try {
//         const [plan] = await db.query(`SELECT * FROM subscription_plans WHERE id = ?`, [planId]);

//         if (plan.length === 0) {
//             return res.status(404).json({ message: "Subscription Plan not found" });
//         }

//         res.status(200).json({ success: true, plan: plan[0] });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


export const updateSubscriptionPlan = async (req, res) => {
    const planId = req.params.id;
    const { plan_name, token_limit, price, validity_days } = req.body;

    const userType = req.user.userType;

    if (userType !== 1) {
        return res.status(403).json({ message: "Only admin can update subscription plans" });
    }
    try {
        const [plan] = await db.query(`SELECT * FROM subscription_plans WHERE id = ?`, [planId]);

        if (plan.length === 0) {
            return res.status(404).json({ message: "Subscription Plan not found" });
        }

        await db.query(
            `UPDATE subscription_plans SET plan_name = ?, token_limit = ?, price = ?, validity_days = ? WHERE id = ?`,
            [plan_name, token_limit, price, validity_days, planId]
        );

        res.status(200).json({ success: true, message: "Subscription Plan updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}



export const deleteSubscriptionPlan = async (req, res) => {
    const planId = req.params.id;

    const userType = req.user.userType;

    if (userType !== 1) {
        return res.status(403).json({ message: "Only admin can delete subscription plans" });
    }

    try {
        const [plan] = await db.query(`SELECT * FROM subscription_plans WHERE id = ?`, [planId]);

        if (plan.length === 0) {
            return res.status(404).json({ message: "Subscription Plan not found" });
        }

        await db.query(`DELETE FROM subscription_plans WHERE id = ?`, [planId]);

        res.status(200).json({ success: true, message: "Subscription Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
