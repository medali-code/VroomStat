import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString, MaxLength } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    readonly otp: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    password: string;
}