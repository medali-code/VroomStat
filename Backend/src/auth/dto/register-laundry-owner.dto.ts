import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber, MaxLength, IsUUID, IsOptional, MinLength } from "class-validator";

export class RegisterLaundryOwnerDto {

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    readonly fullName: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phone: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    @MaxLength(60)
    password: string;

    @ApiProperty({ required: false, description: 'avatar ID' })
    @IsOptional()
    @IsUUID()
    avatar: string;
}