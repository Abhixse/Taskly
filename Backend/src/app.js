import express from "express"
import loginRoute from "./routes/login.routes.js"
import cookieParser from "cookie-parser"
import signupRoute from "./routes/signup.routes.js";
import todoRoute from "./routes/todo.routes.js";
import cors from "cors";


const app = express();

app.use(cors({
    origin: "http://localhost:5173",  // frontend origin (removed trailing slash)
    credentials: true,                // if you're using cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/login', loginRoute);
app.use("/api/v1/signup", signupRoute);
app.use("/api/v1/todo", todoRoute);

export default app;