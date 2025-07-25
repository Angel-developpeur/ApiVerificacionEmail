import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly resend: Resend;

  constructor() {
    // La API key se pasa directamente aquí.
    // Para mayor seguridad en producción, esto debería cargarse desde variables de entorno.
    this.resend = new Resend('re_GYQGDwhK_HN9sJGqJZB4kgNFnCpFRn2wy');
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // Dominio verificado en Resend
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        // Manejo del error de la API de Resend
        console.error({ error });
        throw new Error(`Error sending email: ${error.message}`);
      }

      console.log('Email sent successfully', { data });
      return data;
    } catch (error) {
      // Manejo de errores de red u otros problemas
      console.error('Failed to send email', error);
      throw error;
    }
  }
}
