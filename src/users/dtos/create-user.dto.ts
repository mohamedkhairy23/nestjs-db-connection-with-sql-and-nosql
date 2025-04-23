import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @ApiProperty({ example: 'mohamed' })
  readonly username: string;

  @IsEmail({}, { message: 'incorrect email' })
  @ApiProperty({ example: 'mohamed@gmail.com' })
  readonly email: string;

  @IsString()
  @ApiProperty({ example: 'Egypt' })
  readonly country: string;

  @IsString()
  @ApiProperty({ example: '123456' })
  readonly password: string;
}
