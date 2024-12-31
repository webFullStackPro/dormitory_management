export class LoginForm {
  username?: string;
  password?: string;
  verificationCode?: string;

  constructor(values: Partial<LoginForm>) {
    Object.assign(this, values);
  }
}
