import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangeLaundryOwnerPasswordDto {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(60)
    readonly currentPassword: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(60)
    readonly newPassword: string;
}