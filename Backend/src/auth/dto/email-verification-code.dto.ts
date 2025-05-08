import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailVerificationCodeDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}