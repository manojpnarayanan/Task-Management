import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository";

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) { }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data as T);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
