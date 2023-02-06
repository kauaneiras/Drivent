import { AuthenticatedRequest } from "@/middlewares";
import { Hotel, Room } from "@prisma/client";
import { Response } from "express"; 
import httpStatus from "http-status";
import hotelService from "@/services/hotels-service";

export async function getAllHotelsController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    await hotelService.isHotelPaidService(userId);
    const hotels: Hotel[] = await hotelService.getAllHotelsService();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizerError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export async function getHotelByIDController(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);
  try {
    await hotelService.isHotelIdValidService(hotelId);
    await hotelService.isHotelPaidService(userId);
    const rooms: (Room & {
			Hotel: Hotel;
		})[] = await hotelService.getRoomsByHotelIdService(hotelId);
    return res.status(httpStatus.OK).send(rooms);
  }
  catch (error) {
    if(error.name === "NotFoundError") { return res.sendStatus(httpStatus.NOT_FOUND); } 
    else if (error.name === "UnauthorizerError") { return res.sendStatus(httpStatus.UNAUTHORIZED); } 
    else if (error.name === "BadRequestError") { return res.sendStatus(httpStatus.BAD_REQUEST); } 
    else { return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);}
  }
}
