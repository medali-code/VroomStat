import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class LoginOtpDto {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    readonly otp: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phone: string;
}
