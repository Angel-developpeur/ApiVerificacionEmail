"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const mailer_service_1 = require("../mailer/mailer.service");
const crypto = require("crypto");
let AuthService = class AuthService {
    firebaseService;
    mailerService;
    constructor(firebaseService, mailerService) {
        this.firebaseService = firebaseService;
        this.mailerService = mailerService;
    }
    async sendAuthCode(email) {
        const numericCode = Math.floor(100000 + Math.random() * 900000).toString();
        const apiToken = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.firebaseService.firestore.collection('auth_codes').add({
            email,
            numeric_code: numericCode,
            api_token: apiToken,
            is_validated: false,
            expires_at: expiresAt,
            created_at: new Date(),
        });
        await this.mailerService.sendMail(email, 'Tu código de verificación', `<strong>Tu código de verificación es: ${numericCode}</strong>`);
        return { apiToken };
    }
    async validateCode(email, numericCode, apiToken) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        mailer_service_1.MailerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map