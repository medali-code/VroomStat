import {  Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { EventsService } from './services/event.service';
import { ExcelGenerating } from './services/excel-generating.service';
import { MapDistanceService } from './services/map-distance.service';
import { OnlinePaymentService } from './services/online-payment.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EmailService } from './services/email.service';

// extract extension
function getExtension(originalname) {
    const regexExtension = new RegExp('[^.]+$');
    return originalname.match(regexExtension).toString();
}

const multerConfig = {
    dest: process.env.FILE_UPLOAD_DIRECTORY_PATH,
    fileFilter(req, file, callback) {
        const authorizedMIMEtypes = [
            'image/*',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'text/csv',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.template',
            'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
            'application/vnd.ms-access',
            'application/pdf',
            'audio/mpeg',
            'audio/ogg',
            'video/mp4',
            'audio/wav',
            'video/x-msvideo',
        ];

        if (authorizedMIMEtypes.includes(file.mimetype.toLowerCase())) {
            const extension = getExtension(file.originalname);
            file.extension = extension;

            callback(null, true);
        } else {
            callback(new Error('File mimetype not supported.'), false);
        }
    },
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, process.env.FILE_UPLOAD_DIRECTORY_PATH);
        },
        filename: (req, file, cb) => {
            // format file name to have this: file-{timestamp}.{extension}
            cb(null, `file-${Date.now()}.${getExtension(file.originalname)}`);
        },
    }),
};
@Global()
@Module({
    imports: [
        MulterModule.register(multerConfig),
        CacheModule.register({ ttl: null }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: process.env.MAIL_SECURE === 'true',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                    tls: {
                        ciphers: 'SSLv3',
                    },
                },
                defaults: {
                    from: process.env.MAIL_FROM_NAME,
                },
                template: {
                    adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }
        )],

    providers: [
        MapDistanceService,
        EventsService,
        ExcelGenerating,
        OnlinePaymentService,
        EmailService,
    ],
    exports: [
        MulterModule,
        MapDistanceService,
        EventsService,
        ExcelGenerating,
        OnlinePaymentService,
        EmailService,
    ],
})
export class SharedModule { }
