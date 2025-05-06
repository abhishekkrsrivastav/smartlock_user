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

// assign subscription to customer 
export const assignSubscription = async (req, res) => {
    try {
        const { user_id, device_id, plan_id, start_date, end_date } = req.body;
        const creatorId = req.user.id;
        const userType = req.user.userType;

        if (userType === 3) {
            return res.status(403).json({ message: "Customers cannot assign subscriptions" });
        }

        if (userType === 2) {
            // Vendor can only assign to their own customer
            const [customer] = await db.query(`SELECT * FROM user_data WHERE id = ? AND created_by = ?`, [user_id, creatorId]);
            if (customer.length === 0) {
                return res.status(403).json({ message: "Vendor can assign to their own customers only" });
            }
        }

        const [plan] = await db.query(`SELECT * FROM subscription_plans WHERE id = ?`, [plan_id]);
        if (plan.length === 0) {
            return res.status(404).json({ message: "Plan not found" });
        }

        const [result] = await db.query(
            `INSERT INTO subscriptions (user_id, device_id, plan_id, remaining_tokens, start_date, end_date, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, device_id, plan_id, plan[0].token_limit, start_date, end_date, creatorId]
        );

        res.status(201).json({ success: true, message: "Subscription assigned", id: result.insertId });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// get details of subscription

export const getAllSubscriptions = async (req, res) => {
    const userId = req.user.id;
    const userType = req.user.userType;

    try {
        let query = "";
        let params = [];

        if (userType === 1) {
            query = `select * from subscriptions`;
        }
        else if (userType === 2) {
            query = `select * from subscriptions where created_by=?`;
            params = [userId];
        }
        else {
            query = `select * from subscriptions where user_id=?`;
            params = [userId];
        }

        const [result] = await db.query(query, params);

        res.status(200).json({ success: true, subscriptions: result });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: err.message });
    }

}

// get details by id
export const getSubscriptionDetails = async (req, res) => {
    const subscriptionId = req.params.subscriptionId;
    const userId = req.user.id;
    const userType = req.user.userType;
  
    try {
      const [subscription] = await db.query(
        `SELECT * FROM subscriptions WHERE id = ? AND (created_by = ? OR user_id = ?)`,
        [subscriptionId, userId, userId]
      );
  
      if (subscription.length === 0) {
        return res.status(404).json({ message: "Subscription not found" });
      }
  
      res.status(200).json({ success: true, subscription: subscription[0] });
  
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
