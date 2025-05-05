import db from '../../config/db.js';



export const askKeyword = async (req, res) => {
    try {
        const { keyword } = req.body;

        if (!keyword) {
            return res.status(400).json({ success: false, message: "Keyword is required" });
        }

        const [questionResult] = await db.query(
            "SELECT Question, Response FROM keyword_view WHERE Keyword = ?",
            [keyword]
        );

        if (questionResult.length === 0) {
            return res.status(404).json({ success: false, message: "No question found for this keyword" });
        }

        res.json({
            success: true,
            question: questionResult[0].Question
        });



    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in API',
            error
        })
    }
}



export const getResponse = async (req, res) => {
    try {
        const { answer } = req.body;

        if (!answer) {
            return res.status(400).json({ success: false, message: "Answer is required" });
        }


        const [responseResult] = await db.query(
            "SELECT Response FROM keyword_view WHERE Keyword = ?",
            [answer]
        );

        if (responseResult.length === 0) {
            return res.status(404).json({ success: false, message: "No response found for this answer" });
        }

        res.json({ success: true, response: responseResult[0].Response });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in API',
            error
        })

    }

}

// save sentence in db

export const saveSentence = async (req, res) => {
    try {
        const { sentence } = req.body;
        if (!sentence) {
            return res.status(400).json({
                success: false,
                message: "Sentence is required"
            })
        }

        // const words = sentence.split(" ");
        // const keyword = words.find(w => /^[A-Z]/.test(w)) || words[0];

        const [result] = await db.query(`insert into save_sentence(sentence) values (?)`, [sentence]);

        // const [result] = await db.query(`select Question,Response from keyword_view where keyword=?`, [keyword]);

        // if (result.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No data found for this keyword" 
        //     })
        // }

        res.json({
            success: true,
            message: "Sentence saved successfully",
            sentence: sentence,
            insertId: result.insertId
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in API',
            error
        })
    }
}
 



//  scalable api for all tables 
 

// const allowedTables = ['category', 'actions', 'keywords', 'questions', 'responses'];

// export const createRecord = async (req, res) => {
//     try {
//         const { table } = req.params;
//         const data = req.body;

//         if (!allowedTables.includes(table)) {
//             return res.status(400).json({ success: false, message: "Invalid table name" });
//         }

//         const keys = Object.keys(data);
//         const values = Object.values(data);

//         if (!keys.length) {
//             return res.status(400).json({ success: false, message: "No data provided" });
//         }

//         const placeholders = keys.map(() => '?').join(', ');
//         const [result] = await db.query(
//             `INSERT INTO \`${table}\` (${keys.join(', ')}) VALUES (${placeholders})`,
//             values
//         );

//         res.status(201).json({
//             success: true,
//             message: `${table} record created`,
//             insertId: result.insertId
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error creating record", error });
//     }
// };

// export const getRecord = async (req, res) => {
//     try {
//         const { table, id } = req.params;

//         if (!allowedTables.includes(table)) {
//             return res.status(400).json({ success: false, message: "Invalid table name" });
//         }

//         const idField = `${table.slice(0, -1)}_id`;
//         const query = id
//             ? `SELECT * FROM \`${table}\` WHERE ${idField} = ?`
//             : `SELECT * FROM \`${table}\``;

//         const [rows] = id ? await db.query(query, [id]) : await db.query(query);

//         if (rows.length === 0) {
//             return res.status(404).json({ success: false, message: "No record found" });
//         }

//         res.json({ success: true, data: rows });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error fetching data", error });
//     }
// };

// export const updateRecord = async (req, res) => {
//     try {
//         const { table, id } = req.params;
//         const data = req.body;

//         if (!allowedTables.includes(table)) {
//             return res.status(400).json({ success: false, message: "Invalid table name" });
//         }

//         const keys = Object.keys(data);
//         const values = Object.values(data);

//         if (!keys.length) {
//             return res.status(400).json({ success: false, message: "No update fields provided" });
//         }

//         const setClause = keys.map(key => `${key} = ?`).join(', ');
//         const idField = `${table.slice(0, -1)}_id`;

//         await db.query(
//             `UPDATE \`${table}\` SET ${setClause} WHERE ${idField} = ?`,
//             [...values, id]
//         );

//         res.json({ success: true, message: `${table} record updated` });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error updating record", error });
//     }
// };

// export const deleteRecord = async (req, res) => {
//     try {
//         const { table, id } = req.params;

//         if (!allowedTables.includes(table)) {
//             return res.status(400).json({ success: false, message: "Invalid table name" });
//         }

//         const idField = `${table.slice(0, -1)}_id`;

//         const [result] = await db.query(
//             `DELETE FROM \`${table}\` WHERE ${idField} = ?`,
//             [id]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ success: false, message: "No record found to delete" });
//         }

//         res.json({ success: true, message: `${table} record deleted` });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error deleting record", error });
//     }
// };




// //new

// export const insertFullIntent = async (req, res) => {
//     const { category_name, action_name, keywords, question_text, responses } = req.body;
  
//     try {
//       // 1. Insert category (or get existing)
//       const [catRows] = await db.query(
//         `INSERT INTO category (category_name) 
//          VALUES (?) 
//          ON DUPLICATE KEY UPDATE category_id = LAST_INSERT_ID(category_id)`,
//         [category_name]
//       );
//       const category_id = catRows.insertId;
  
//       // 2. Insert action
//       const [actionRows] = await db.query(
//         `INSERT INTO actions (action_name, category_id) 
//          VALUES (?, ?)`,
//         [action_name, category_id]
//       );
//       const action_id = actionRows.insertId;
  
//       // 3. Insert keywords and build map
//       const keywordIdMap = {};
//       for (const keyword of keywords) {
//         const [kwRows] = await db.query(
//           `INSERT INTO keywords (keyword_name, action_id) 
//            VALUES (?, ?)`,
//           [keyword, action_id]
//         );
//         keywordIdMap[keyword] = kwRows.insertId;
//       }
  
//       // 4. Insert question
//       await db.query(
//         `INSERT INTO questions (action_id, question_text) 
//          VALUES (?, ?)`,
//         [action_id, question_text]
//       );
  
//       // 5. Insert responses mapped to keywords
//       for (const [keywordKey, response_text] of Object.entries(responses)) {
//         let keywordId = keywordIdMap[keywordKey];
  
//         // fallback to first keyword if key not matched
//         if (!keywordId) {
//           keywordId = Object.values(keywordIdMap)[0];
//         }
  
//         await db.query(
//           `INSERT INTO responses (keyword_id, response_text) 
//            VALUES (?, ?)`,
//           [keywordId, response_text]
//         );
//       }
  
//       res.status(201).json({
//         success: true,
//         message: "Intent inserted successfully with all related data."
//       });
  
//     } catch (error) {
//         console.error("Insert intent failed:", error.sqlMessage || error.message);
//         return res.status(500).json({
//           success: false,
//           message: "Insert intent failed",
//           error: error.sqlMessage || error.message
//         });
//     }
//   };
  
  

 

export const addData = async (req, res) => {
  const { category, action, keyword, question, response } = req.body;

  try {
    // 1. Insert Category
    const categoryQuery = 'INSERT INTO category (category_name) VALUES (?)';
    const [categoryResult] = await db.query(categoryQuery, [category.category_name]);

    // 2. Insert Action with category_id
    const actionQuery = 'INSERT INTO actions (action_name, category_id) VALUES (?, ?)';
    const [actionResult] = await db.query(actionQuery, [action.action_name, categoryResult.insertId]);

    // 3. Insert Keyword with action_id
    const keywordQuery = 'INSERT INTO keywords (keyword_name, action_id) VALUES (?, ?)';
    const [keywordResult] = await db.query(keywordQuery, [keyword.keyword_name, actionResult.insertId]);

    // 4. Insert Question with action_id
    const questionQuery = 'INSERT INTO questions (question_text, action_id) VALUES (?, ?)';
    await db.query(questionQuery, [question.question_text, actionResult.insertId]);

    // 5. Insert Response with keyword_id
    const responseQuery = 'INSERT INTO responses (response_text, keyword_id) VALUES (?, ?)';
    await db.query(responseQuery, [response.response_text, keywordResult.insertId]);

    // Return success response
    res.status(201).json({ message: 'Data successfully added!' });
  } catch (error) {
    console.error('Error while adding data:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
};
