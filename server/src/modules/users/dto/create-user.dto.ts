import { IsEmail, IsString, MinLength, IsEnum} from "class-validator";
import { UserRole } from '@prisma/client'; 

export class CreateUsersDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

   @IsEnum(UserRole, { message: 'Role must be ADMIN, PM, REQUESTER, PRODUCTION_LEAD, OPERATOR_BREAKDOWN, ENGINEER_JOINT, ENGINEER_HOUSING, ENGINEER_JIG, ENGINEER_VISUAL, ENGINEER_JS_ACC or ENGINEER_JS_FIN' })
     role: UserRole;
  
}