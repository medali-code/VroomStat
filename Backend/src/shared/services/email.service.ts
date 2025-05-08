import { Injectable, NotAcceptableException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendCustomMessage({
        object,
        message,
        to
    }: {
        to: string;
        message: string;
        object: string;
    }) {
        return this.send(
            to,
            'MS SOAP team',
            `${process.cwd()}/templates/custom-email`,
            {
                message,
                object
            },
        );
    }

    private send(
        to: string,
        subject: string,
        templateName: string,
        context: Record<string, string>,
    ) {
        return this.mailerService
            .sendMail({
                to,
                subject,
                template: templateName,
                context,
            })
            // @todo replace it with event
            .catch(() => { throw new NotAcceptableException('لا يمكن إرسال البريد الإلكتروني ، يرجى المحاولة مرة أخرى') })
            .then(() => console.log('sent'))

    }
}
