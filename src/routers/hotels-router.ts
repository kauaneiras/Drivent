import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getAllHotelsController, getHotelByIDController } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getAllHotelsController)
  .get("/:hotelId", getHotelByIDController);

export { hotelsRouter };
