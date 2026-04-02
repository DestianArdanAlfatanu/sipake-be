import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Email harus diisi' })
  email: string;

  @IsNotEmpty({ message: 'Kode OTP harus diisi' })
  code: string;

  @IsNotEmpty({ message: 'Password baru harus diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  newPassword: string;
}
