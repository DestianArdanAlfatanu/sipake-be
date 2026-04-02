import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email harus diisi' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;
}
