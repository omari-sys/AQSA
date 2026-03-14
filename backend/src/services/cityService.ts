import { City, ICity } from "../models/City";

export async function listCities(): Promise<ICity[]> {
  return City.find().sort({ name: 1 }).exec();
}

export async function createCity(name: string): Promise<ICity> {
  const city = new City({ name });
  await city.save();
  return city;
}

