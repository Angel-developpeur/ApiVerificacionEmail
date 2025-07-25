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
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailerService = class MailerService {
    resend;
    constructor() {
        this.resend = new resend_1.Resend('re_GYQGDwhK_HN9sJGqJZB4kgNFnCpFRn2wy');
    }
    async sendMail(to, subject, html) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                html: html,
            });
            if (error) {
                console.error({ error });
                throw new Error(`Error sending email: ${error.message}`);
            }
            console.log('Email sent successfully', { data });
            return data;
        }
        catch (error) {
            console.error('Failed to send email', error);
            throw error;
        }
    }
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailerService);
//# sourceMappingURL=mailer.service.js.map