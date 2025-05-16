import db from '../../config/db.js'



// assign subscription to customer 
export const assignSubscription = async (req, res) => {
  try {
    const { user_id, device_id, plan_id, start_date, end_date } = req.body; // device_id is an array
    const creatorId = req.user.id;
    const userType = req.user.userType;

    // if (userType === 3) {
    //   return res.status(403).json({ message: "Customers cannot assign subscriptions" });
    // }

    if (userType === 3 && user_id !== req.user.id) {
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

    // 1. Insert subscription
    const [result] = await db.query(
      `INSERT INTO subscriptions (user_id, plan_id, remaining_tokens, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, plan_id, plan[0].token_limit, start_date, end_date, creatorId]
    );

    const subscriptionId = result.insertId;

    // 2. Insert device mapping into subscription_devices
    if (Array.isArray(device_id) && device_id.length > 0) {
      const values = device_id.map(deviceId => [subscriptionId, deviceId]);
      await db.query(
        `INSERT INTO subscription_devices (subscription_id, device_id) VALUES ?`,
        [values]
      );
    }

    res.status(201).json({ success: true, message: "Subscription assigned", id: subscriptionId });
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
      query = `SELECT * FROM subscriptions WHERE user_id = ?`;
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


// get details by id
// export const getSubscriptionDetails = async (req, res) => {
//     const subscriptionId = req.params.Id;
//     const userId = req.user.id;
//     const userType = req.user.userType;

//     try {
//         const [subscription] = await db.query(
//             `SELECT * FROM subscriptions WHERE id = ? AND (created_by = ? OR user_id = ?)`,
//             [subscriptionId, userId, userId]
//         );

//         if (subscription.length === 0) {
//             return res.status(404).json({ message: "Subscription not found" });
//         }

//         res.status(200).json({ success: true, subscription: subscription[0] });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

export const deleteSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const creatorId = req.user.id;
    const userType = req.user.userType;

    const [subscription] = await db.query(
      `SELECT * FROM subscriptions WHERE id = ? AND (created_by = ? OR user_id = ?)`,
      [subscriptionId, creatorId, creatorId]
    );

    if (subscription.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (userType === 2 && subscription[0].created_by !== creatorId) {
      return res.status(403).json({ message: "Vendors can only delete their own customers' subscriptions" });
    }

    // Step 1: Delete devices mapping
    await db.query(`DELETE FROM subscription_devices WHERE subscription_id = ?`, [subscriptionId]);

    // Step 2: Delete the subscription itself
    await db.query(`DELETE FROM subscriptions WHERE id = ?`, [subscriptionId]);

    res.status(200).json({ success: true, message: "Subscription deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const updateSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const { user_id, device_id, plan_id, start_date, end_date } = req.body;

    if (!user_id || !plan_id || !start_date || !end_date || !Array.isArray(device_id)) {
      return res.status(400).json({ message: "Missing or invalid required fields" });
    }

    const userType = req.user.userType;
    const requesterId = req.user.id;

    if (userType === 3) {
      return res.status(403).json({ message: "Customers are not allowed to update subscriptions" });
    }

    if (userType === 2) {
      const [customer] = await db.query(
        `SELECT * FROM user_data WHERE id = ? AND created_by = ?`,
        [user_id, requesterId]
      );
      if (customer.length === 0) {
        return res.status(403).json({ message: "Vendors can only update their own customers' subscriptions" });
      }
    }

    const [plan] = await db.query(`SELECT * FROM subscription_plans WHERE id = ?`, [plan_id]);
    if (plan.length === 0) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const [existing] = await db.query(`SELECT * FROM subscriptions WHERE id = ?`, [subscriptionId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Update subscription table (excluding device_id)
    await db.query(
      `UPDATE subscriptions SET 
        user_id = ?, 
        plan_id = ?, 
        remaining_tokens = ?, 
        start_date = ?, 
        end_date = ?
      WHERE id = ?`,
      [user_id, plan_id, plan[0].token_limit, start_date, end_date, subscriptionId]
    );

    // Remove old device mappings
    await db.query(`DELETE FROM subscription_devices WHERE subscription_id = ?`, [subscriptionId]);

    // Add new device mappings
    const deviceValues = device_id.map(devId => [subscriptionId, devId]);
    await db.query(
      `INSERT INTO subscription_devices (subscription_id, device_id) VALUES ?`,
      [deviceValues]
    );

    res.status(200).json({ success: true, message: "Subscription updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

