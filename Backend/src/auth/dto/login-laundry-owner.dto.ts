import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginLaundryOwnerDto {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    readonly password: string;
}
