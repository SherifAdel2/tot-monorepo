import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import usersRouter from "./routes/users";

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>tot API</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0d1117;
          color: #c9d1d9;
          font-family: "Segoe UI", system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 2.5rem 3rem;
          max-width: 420px;
          width: 100%;
        }
        h1 { font-size: 1.4rem; color: #58a6ff; margin-bottom: 0.25rem; }
        .status {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.85rem; color: #3fb950; margin-bottom: 1.75rem;
        }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #3fb950; box-shadow: 0 0 6px #3fb950;
        }
        nav { display: flex; flex-direction: column; gap: 0.6rem; }
        a {
          display: flex; justify-content: space-between; align-items: center;
          text-decoration: none; color: #c9d1d9;
          background: #0d1117; border: 1px solid #30363d;
          border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.9rem;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        a:hover { border-color: #58a6ff; transform: translateX(2px); }
        code { color: #79c0ff; font-family: "Fira Code", monospace; }
        .method {
          font-size: 0.7rem; font-weight: 600; color: #3fb950;
          border: 1px solid #3fb950; border-radius: 4px; padding: 0.1rem 0.4rem;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>tot API</h1>
        <div class="status"><span class="dot"></span>running</div>
        <nav>
          <a href="/api/products">
            <code>/api/products</code>
            <span class="method">GET</span>
          </a>
          <a href="/api/users">
            <code>/api/users</code>
            <span class="method">GET</span>
          </a>
        </nav>
      </div>
    </body>
    </html>
  `);
});

export default app;
