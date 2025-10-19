import { IsString, IsOptional, IsBoolean, IsEmail, MinLength, MaxLength, IsDateString } from 'class-validator';

export class CreateUsersDto {
  @IsString({
    message: 'Tên người dùng phải là một chuỗi',
  })
  @MaxLength(100, {
    message: 'Tên người dùng không được vượt quá 100 ký tự',
  })
  name: string;

  @IsEmail({}, {
    message: 'Email không đúng định dạng',
  })
  email: string;

  @IsString({
    message: 'Tên đăng nhập phải là một chuỗi',
  })
  @MinLength(3, {
    message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
  })
  @MaxLength(50, {
    message: 'Tên đăng nhập không được vượt quá 50 ký tự',
  })
  username: string;

  @IsString({
    message: 'Mật khẩu phải là một chuỗi',
  })
  @MinLength(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự',
  })
  @MaxLength(100, {
    message: 'Mật khẩu không được vượt quá 100 ký tự',
  })
  password: string;

  @IsOptional()
  @IsBoolean({
    message: 'Trạng thái hoạt động phải là true hoặc false',
  })
  isActive?: boolean;

  @IsOptional()
  @IsDateString({}, {
    message: 'Ngày sinh phải là chuỗi ngày hợp lệ (YYYY-MM-DD)',
  })
  birthDate?: string;
}
