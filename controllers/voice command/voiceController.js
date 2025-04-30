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

// adding keyword

export const addKeyword = async (req, res) => {
    try {
        // const {category_name } = req.body;
        // if(!category_name){
        //     return res.status(400).json({
        //         success:false,
        //         message:"Missing reequired fields"
        //     });
        // }
        // const [categoryResult]=await db.query(`insert into category(category_name) values(?)`,[category_name])
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Api",
            details: error.message
        })

    }
}

