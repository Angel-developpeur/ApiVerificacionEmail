"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
let FirebaseService = class FirebaseService {
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
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)()
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map