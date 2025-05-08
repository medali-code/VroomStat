import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, IsPhoneNumber } from "class-validator";

export class LoginBusinessCustomer {
    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phone: string;

    @ApiProperty({ required: true, })
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    readonly password: string;
}
