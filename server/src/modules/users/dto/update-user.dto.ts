import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-user.dto';
import { IsEmail, IsString, MinLength} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUsersDto) {
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;
    
    @MinLength(6)
    password: string;
    
    @IsString()
    role: string;
      
}
