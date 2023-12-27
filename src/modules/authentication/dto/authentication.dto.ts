import { IsEmail, IsString } from "class-validator";

export class AuthenticationDto {
    @IsEmail()
    email: string

    @IsString()
    password: string
}
