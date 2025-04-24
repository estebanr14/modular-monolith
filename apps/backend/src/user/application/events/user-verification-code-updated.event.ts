export class UserVerificationCodeUpdatedEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
