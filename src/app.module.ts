import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [AuthModule, FirebaseModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}