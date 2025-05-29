import db from '../../config/db.js'
import dayjs from 'dayjs';


// assign subscription to customer 

export const assignSubscription = async (req, res) => {
  try {
    const { device_id, plan_id } = req.body;
    const creatorId = req.user.id;
    const userType = req.user.userType;

    const user_id = req.body.user_id || req.user.id;

    if (userType === 3 && req.user.id !== user_id) {
      return res.status(403).json({ message: "Customers can only assign subscriptions to themselves" });
    }

    if (userType === 2) {
      const [customer] = await db.query(
        `SELECT * FROM user_data WHERE id = ? AND created_by = ?`,
        [user_id, creatorId]
      );
      if (customer.length === 0) {
        return res.status(403).json({ message: "Vendors can assign to their own customers only" });
      }
    }

    const [plan] = await db.query(`SELECT * FROM subscription_plans WHERE id = ?`, [plan_id]);
    if (plan.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }


    await db.query(
      `UPDATE subscriptions SET status_id = 4 WHERE user_id = ? AND status_id = 3`,
      [user_id]
    );

    const now = dayjs();
    const start_date = now.format("YYYY-MM-DD HH:mm:ss");
    const end_date = now.add(plan[0].validity_days, 'day').format("YYYY-MM-DD HH:mm:ss");

    const [result] = await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, remaining_tokens, start_date, end_date, created_by, status_id)
       VALUES (?, ?, ?, ?, ?, ?, 3)`,
      [user_id, plan_id, plan[0].token_limit, start_date, end_date, creatorId]
    );

    const subscriptionId = result.insertId;


    if (Array.isArray(device_id) && device_id.length > 0) {
      const values = device_id.map(deviceId => [subscriptionId, deviceId]);
      await db.query(
        `INSERT INTO subscription_devices (subscription_id, device_id) VALUES ?`,
        [values]
      );
    }

    res.status(201).json({ success: true, message: "Subscription assigned successfully", id: subscriptionId, start_date, end_date });
  } catch (err) {
    console.error("Subscription assign error:", err);
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
      // Admin: get all subscriptions
      query = `SELECT * FROM subscriptions`;
    } else if (userType === 2) {
      // Vendor: get subscriptions created by this vendor
      query = `SELECT * FROM subscriptions WHERE created_by = ?`;
      params = [userId];
    } else {
      // Customer: get own subscriptions
      query = `SELECT * FROM subscriptions WHERE user_id = ? AND status_id != 5`;
      params = [userId];
    }

    const [subs] = await db.query(query, params);

    // Now, for each subscription, get its device_ids
    for (let sub of subs) {
      const [devices] = await db.query(
        `SELECT device_id FROM subscription_devices WHERE subscription_id = ?`,
        [sub.id]
      );
      sub.device_ids = devices.map(d => d.device_id);
    }

    res.status(200).json({ success: true, subscriptions: subs });

  } catch (error) {
    console.error("getAllSubscriptions error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete 

export const deleteSubscription = async (req, res) => {
  const userId = req.user.id;
  const { subscription_id } = req.body;

  try {
    const [result] = await db.query(`update subscriptions set status_id = 5 where id= ? and user_id= ?`, [subscription_id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subscription not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message })

  }
}

