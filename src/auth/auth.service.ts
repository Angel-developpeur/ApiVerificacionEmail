import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { MailerService } from '../mailer/mailer.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly mailerService: MailerService,
  ) {}

  async sendAuthCode(email: string): Promise<{ apiToken: string }> {
    const numericCode = Math.floor(100000 + Math.random() * 900000).toString();
    const apiToken = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expira en 10 minutos

    await this.firebaseService.firestore.collection('auth_codes').add({
      email,
      numeric_code: numericCode,
      api_token: apiToken,
      is_validated: false,
      expires_at: expiresAt,
      created_at: new Date(),
    });

    await this.mailerService.sendMail(
      email,
      'Tu código de verificación',
      `<strong>Tu código de verificación es: ${numericCode}</strong>`,
    );

    return { apiToken };
  }

  async validateCode(
    email: string,
    numericCode: string,
    apiToken: string,
  ): Promise<boolean> {
    const now = new Date();
    const querySnapshot = await this.firebaseService.firestore
      .collection('auth_codes')
      .where('email', '==', email)
      .where('numeric_code', '==', numericCode)
      .where('api_token', '==', apiToken)
      .where('is_validated', '==', false)
      .where('expires_at', '>', now)
      .get();

    if (querySnapshot.empty) {
      return false;
    }

    const doc = querySnapshot.docs[0];
    await doc.ref.delete();

    return true;
  }
}
