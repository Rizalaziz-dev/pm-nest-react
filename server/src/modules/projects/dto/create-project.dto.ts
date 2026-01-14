import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsDate, 
  IsUUID 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectType } from '@prisma/client'; // Import Enum from Prisma

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Assy Number is required' })
  assyNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Customer Name is required' })
  customer: string;

  @IsString()
  @IsNotEmpty()
  totalPo: string;

  // Validates that the value is strictly "REGULAR" or "PROTOTYPE"
  @IsEnum(ProjectType, { message: 'Plotting must be REGULAR or PROTOTYPE' })
  plotting: ProjectType;

  // TRANSFORMER: Converts "2026-01-20T17:00:00.000Z" -> Date Object
  @Type(() => Date)
  @IsDate({ message: 'Order Date must be a valid ISO Date' })
  orderDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'ETD must be a valid ISO Date' })
  etd: Date;

  // Validates that the ID sent is a real UUID format
  @IsUUID()
  pmId: string;
}