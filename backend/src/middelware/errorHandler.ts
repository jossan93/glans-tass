import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "ogiltig data", details: err.message });
  }

  if (err.name === "castError") {
    return res.status(400).json({ error: "felaktigt Id-format" });
  }

  res.status(500).json({ error: "något gick fel på servern" });
};
