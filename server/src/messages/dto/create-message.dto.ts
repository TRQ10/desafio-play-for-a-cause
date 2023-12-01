import { ZodError } from "zod";
import { Message, MessageSchema } from "../entities/message.entity";

export class CreateMessageDto {
    name: string;
    message: string;
  
    constructor(data: Message) {
      this.name = data.name;
      this.message = data.message;
    }
  
    static from(data: any): CreateMessageDto {
      try {
        const validatedData = MessageSchema.parse(data);
        return new CreateMessageDto(validatedData);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new Error(`Validation failed: ${error.errors}`);
        }
        throw error;
      }
    }
  }