import { Request, Response } from "express";
import app from "./app";

const PORT = process.env.PORT || 4000;

// console.log(PORT);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from your TypeScript backend!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
