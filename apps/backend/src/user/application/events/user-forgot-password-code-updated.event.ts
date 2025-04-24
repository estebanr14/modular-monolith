export class UserForgotPasswordCodeUpdatedEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
