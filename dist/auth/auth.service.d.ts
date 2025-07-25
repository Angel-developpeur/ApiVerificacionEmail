import { FirebaseService } from '../firebase/firebase.service';
import { MailerService } from '../mailer/mailer.service';
export declare class AuthService {
    private readonly firebaseService;
    private readonly mailerService;
    constructor(firebaseService: FirebaseService, mailerService: MailerService);
    sendAuthCode(email: string): Promise<{
        apiToken: string;
    }>;
    validateCode(email: string, numericCode: string, apiToken: string): Promise<boolean>;
}
