import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto } from './dto/send-code.dto';
import { ValidateCodeDto } from './dto/validate-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body(new ValidationPipe()) sendCodeDto: SendCodeDto) {
    const { apiToken } = await this.authService.sendAuthCode(sendCodeDto.email);
    return { message: 'Code sent successfully', apiToken };
  }

  @Post('validate-code')
  async validateCode(@Body(new ValidationPipe()) validateCodeDto: ValidateCodeDto) {
    const isValid = await this.authService.validateCode(
      validateCodeDto.email,
      validateCodeDto.code,
      validateCodeDto.apiToken,
    );
    return { isValid };
  }
}
