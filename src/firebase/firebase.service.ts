
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const credentialsPath = path.join(process.cwd(), 'firebase-credentials.json');
    const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  get firestore() {
    return admin.firestore();
  }
}
