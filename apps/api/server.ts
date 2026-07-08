import app from "./src/app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
