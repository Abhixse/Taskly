import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js"

dotenv.config();

const PORT = process.env.PORT || 8000;


connectDB()
    .then(() => {

        app.listen(PORT, (req, res) => {
            console.log(`http://localhost:${PORT}`);
        })
    })
    .catch((err) => console.log(err))

