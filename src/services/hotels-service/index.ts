import { Ticket, TicketType, TicketStatus, Room, Hotel, Enrollment, Address } from "@prisma/client";
import { badRequestError } from "@/errors/bad-request-error";
import { notFoundError, unauthorizedError } from "@/errors";

import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getAllHotelsService(): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelRepository.findHotelsRepository();
  if(!hotels) throw notFoundError();
  return hotels;
}

async function getRoomsByHotelIdService(hotelId: number): Promise<(Room & { Hotel: Hotel;
})[]> { const rooms: (Room & { Hotel: Hotel;})[] = await hotelRepository.findRoomsByHotelIdRepository(hotelId);
  if(!rooms) throw notFoundError();
  return rooms;
}

async function isHotelIdValidService(hotelId: number): Promise<Hotel> {
  const hotel: Hotel = await hotelRepository.isHotelIdValidRepository(hotelId);
  if(!hotel) throw notFoundError();
  return hotel;
}

async function isHotelPaidService(userId: number): Promise<Ticket & {
	TicketType: TicketType;
}> {
  const enrollment: Enrollment & {
    Address: Address[];
} = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) { throw unauthorizedError(); }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) { throw badRequestError(); } 
  if (ticket.TicketType.isRemote !== false) { throw badRequestError(); } 
  if (ticket.TicketType.includesHotel !== true) { throw badRequestError(); } 
  if (ticket.status === TicketStatus.RESERVED) { throw badRequestError(); }
  return ticket;
}

const hotelService = { getAllHotelsService, getRoomsByHotelIdService, isHotelPaidService, isHotelIdValidService };
export default hotelService;
