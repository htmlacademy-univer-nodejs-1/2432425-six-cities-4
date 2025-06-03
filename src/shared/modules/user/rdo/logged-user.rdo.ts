import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;

  constructor(token: string, email: string) {
    this.token = token;
    this.email = email;
  }
}
