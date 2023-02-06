import { prisma } from "@/config";
import { Hotel, Room } from "@prisma/client";

async function findHotelsRepository(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findRoomsByHotelIdRepository(hotelId: number): Promise<(Room & { Hotel: Hotel; })[]> {
  return prisma.room.findMany({ where: { hotelId }, include: { Hotel: true } });
}

async function isHotelIdValidRepository(hotelId: number): Promise<Hotel> {
  return prisma.hotel.findFirst({ where: { id: hotelId } });
}

const hotelRepository = { findHotelsRepository,findRoomsByHotelIdRepository, isHotelIdValidRepository };

export default hotelRepository;
