import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 60)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 128)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+[\d\-]{7,20}$/, {
    message: 'Nomor HP harus diawali kode negara, contoh: +628123456789',
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  address: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 4)
  car_series_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 6)
  engine_code: string;

  @IsNotEmpty()
  car_year: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  plateNumber: string;
}
