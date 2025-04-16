import { Exclude, Expose } from 'class-transformer';
import { User } from '../user.entity';

export class UserResponseDto {
  id: string;
  username: string;
  email: string;

  @Expose({ name: 'Country' })
  country: string;

  @Expose({ name: 'City' })
  city: string;

  @Expose({ name: 'Area' })
  street: string;

  @Expose({ name: 'Address' })
  getAddress(): string {
    return this.country + ', ' + this.city + ', ' + this.street;
  }

  @Exclude()
  password: string;

  constructor(user: User) {
    this.id = user.id.toString();
    this.username = user.username;
    this.email = user.email;
    this.country = user.country;
    this.city = user.city;
    this.street = user.street;

    // this.password = user.password;
  }
}
