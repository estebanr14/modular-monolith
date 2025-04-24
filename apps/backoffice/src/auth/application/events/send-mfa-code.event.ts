export class SendMfaCodeEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {}
}
