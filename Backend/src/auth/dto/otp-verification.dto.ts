import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class OtpVerificationDto {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phone: string;
}
