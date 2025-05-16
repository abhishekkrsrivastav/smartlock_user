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



// export const addData = async (req, res) => {
//     const { category_name, action_name, keyword_name, question_text, response_text } = req.body;

//     try {
//       // 1. Check or Insert Category
//       let [catResult] = await db.query('SELECT category_id FROM category WHERE category_name = ?', [category_name]);
//       let categoryId;
//       if (catResult.length > 0) {
//         categoryId = catResult[0].category_id;
//       } else {
//         const [insertCat] = await db.query('INSERT INTO category (category_name) VALUES (?)', [category_name]);
//         categoryId = insertCat.insertId;
//       }

//       // 2. Insert Action
//       const [insertAction] = await db.query(
//         'INSERT INTO actions (action_name, category_id) VALUES (?, ?)',
//         [action_name, categoryId]
//       );
//       const actionId = insertAction.insertId;

//       // 3. Insert Keyword
//       const [insertKeyword] = await db.query(
//         'INSERT INTO keywords (keyword_name, action_id) VALUES (?, ?)',
//         [keyword_name, actionId]
//       );
//       const keywordId = insertKeyword.insertId;

//       // 4. Insert Question
//       await db.query('INSERT INTO questions (question_text, action_id) VALUES (?, ?)', [question_text, actionId]);

//       // 5. Insert Response
//       await db.query('INSERT INTO responses (response_text, keyword_id) VALUES (?, ?)', [response_text, keywordId]);

//       res.status(201).json({ message: `Data added under category '${category_name}' successfully!` });
//     } catch (err) {
//       console.error('Error adding data:', err);
//       res.status(500).json({ error: 'Something went wrong!' });
//     }
//   };






export const addVoiceFlowData = async (req, res) => {
    const { category_name, language_code = 'en', actions } = req.body;


    try {
        // Category Insert or Get
        let [categoryRows] = await db.query(
            'SELECT category_id FROM category1 WHERE category_name = ?',
            [category_name]
        );

        let category_id;
        if (categoryRows.length === 0) {
            const [categoryResult] = await db.query(
                'INSERT INTO category1 (category_name) VALUES (?)',
                [category_name]
            );
            category_id = categoryResult.insertId;
        } else {
            category_id = categoryRows[0].category_id;
        }

        for (const action of actions) {
            // Insert into actions1
            const [actionResult] = await db.query(
                'INSERT INTO actions1 (action_name, category_id, question_text, language_code) VALUES (?, ?, ?, ?)',
                [action.action_name, category_id, action.question_text, language_code]
            );
            const action_id = actionResult.insertId;

            // Insert into keywords1
            for (const keyword of action.keywords) {
                await db.query(
                    'INSERT INTO keywords1 (keyword_name, action_id, language_code) VALUES (?, ?, ?)',
                    [keyword, action_id, language_code]
                );
            }

            // Insert into responses1
            for (const [input, responseText] of Object.entries(action.responses)) {
                const isDefault = input.toLowerCase() === 'default';
                await db.query(
                    'INSERT INTO responses1 (action_id, user_input, response_text, is_default, language_code) VALUES (?, ?, ?, ?, ?)',
                    [action_id, input, responseText, isDefault, language_code]
                );
            }
        }


        res.status(201).json({ message: 'Voice command data inserted successfully' });
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};




export const detectIntent = async (req, res) => {
    const { spoken_text, language_code = 'en' } = req.body;

    try {
        const [rows] = await db.query(
            `SELECT k.keyword_id, a.action_id, a.action_name, a.question_text
       FROM keywords1 k
       JOIN actions1 a ON k.action_id = a.action_id
       WHERE k.keyword_name = ? AND k.language_code = ?
       LIMIT 1`,
            [spoken_text, language_code]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "No matching keyword found." });
        }

        const { action_id, action_name, question_text } = rows[0];
        return res.json({ action_id, action_name, question: question_text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};


export const getResponses = async (req, res) => {
    const { action_id, user_input, language_code = 'en' } = req.body;

    try {
        // Try to find exact match
        const [rows] = await db.query(
            `SELECT response_text FROM responses1 
       WHERE action_id = ? AND user_input = ? AND language_code = ? 
       LIMIT 1`,
            [action_id, user_input.toLowerCase(), language_code]
        );

        if (rows.length > 0) {
            return res.json({ response: rows[0].response_text });
        }

        // Fallback: get default response
        const [defaultRow] = await db.query(
            `SELECT response_text FROM responses1 
       WHERE action_id = ? AND is_default = TRUE AND language_code = ? 
       LIMIT 1`,
            [action_id, language_code]
        );

        // if (defaultRow.length > 0) {
        //   return res.json({ response: defaultRow[0].response_text });
        // }

        // res.status(404).json({ message: "No response found." });


        // If default response found, also store unknown input
        if (defaultRow.length > 0) {
            // Log the unknown input
            const [saveData] = await db.query(
                `INSERT INTO unknown_inputs (action_id, user_input, language_code) VALUES (?, ?, ?)`,
                [action_id, user_input.toLowerCase(), language_code]
            );
            // console.log(saveData);

            return res.json({
                response: defaultRow[0].response_text,
                savedData: {
                    insertId: saveData.insertId,
                    user_input: user_input.toLowerCase(),
                    // language_code: language_code,
                    action_id: action_id
                }
            });
        }
        res.status(404).json({ message: "No response found." });



    } catch (error) {
        console.error("getResponse error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
