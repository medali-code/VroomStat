import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, MaxLength, IsPhoneNumber } from "class-validator";

export class RegisterCustomerDto {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phone: string;
}
