export declare class MailerService {
    private readonly resend;
    constructor();
    sendMail(to: string, subject: string, html: string): Promise<import("resend").CreateEmailResponseSuccess>;
}
