import express from "express";
import cookieParser from "cookie-parser";
import documentRoutes from "./routes/documentRoutes.js";
import { runMigrations } from "./migrations/index.js";
import { RPCObserver } from "./lib/rabbitmq/index.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { PORT, DOCUMENT_SERVICE_RPC } from "./config/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// runMigrations()

// RPCObserver
RPCObserver(DOCUMENT_SERVICE_RPC);

// routes
app.use("/api/documents", documentRoutes);
app.get("/api", (req, res) => res.status(200).json("document service is listening"));

//error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`service is listening on port ${PORT}`));
