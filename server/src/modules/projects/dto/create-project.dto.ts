import { 
  IsString, 
  IsNotEmpty, 
  IsEnum, 
  IsDate, 
  IsNumber, 
  IsOptional,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectScope, ProjectType } from '@prisma/client'; // Import Enum from Prisma

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Assy Number is required' })
  assyNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Customer Name is required' })
  customer: string;

  @IsInt()
  @IsNotEmpty()
  totalPo: number;

  // Validates that the value is strictly "REGULAR" or "PROTOTYPE"
  @IsEnum(ProjectType, { message: 'Plotting must be REGULAR or PROTOTYPE' })
  plotting: ProjectType;

  // NEW ASSY vs MODIFICATION (Workload Weight)
  @IsEnum(ProjectScope, { message: 'Scope must be NEW_ASSY, MODIF_MAJOR, or MODIF_MINOR' })
  scope: ProjectScope;

  // How many days for Phase 1? (Default 5)
  @IsNumber()
  @IsOptional()
  breakdownDays?: number;

  // TRANSFORMER: Converts "2026-01-20T17:00:00.000Z" -> Date Object
  @Type(() => Date)
  @IsDate({ message: 'Order Date must be a valid ISO Date' })
  orderDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'ETD must be a valid ISO Date' })
  etd: Date;

  @IsString()
  @IsOptional() 
  pmId?: string;
}