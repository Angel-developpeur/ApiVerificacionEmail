import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { ValidateCodeDto } from './dto/validate-code.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendCode(sendCodeDto: SendCodeDto): Promise<{
        message: string;
        apiToken: string;
    }>;
    validateCode(validateCodeDto: ValidateCodeDto): Promise<{
        isValid: boolean;
    }>;
}
