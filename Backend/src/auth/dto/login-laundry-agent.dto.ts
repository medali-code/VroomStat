import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginLaundryAgentDto {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    readonly code: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    readonly password: string;
}
