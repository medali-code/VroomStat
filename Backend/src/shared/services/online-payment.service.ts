import axios from 'axios';
import { URWAY } from "urway.js";

import * as  aesjs from 'aes-js';

export class OnlinePaymentService {
    private urway: URWAY;
    private terminalId: string;
    private password: string;
    private secret: string;

    constructor() {

        this.terminalId = process.env.URWAYTERMINALID;
        this.password = process.env.URWAYPASSWORD;
        this.secret = process.env.URWAYSECRET;

        this.urway = new URWAY({
            terminalId: this.terminalId,
            password: this.password,
            secret: this.secret,
            // mode: 'production', // This parameter is required in production.
        });
    }

    aesEncryptPurchaseTransaction(amount: number, trackId: string) {
        return this.aesEncrypt([{
            amt: amount.toFixed(2),
            action: "1",
            password: "e5#A@K$8daSu2L1",
            id: "r47ft9FN49qJTpS",
            currencyCode: process.env.CURRENCY_CODE,
            trackId: trackId,
            responseURL: `${process.env.SWAGER_SERVER}/api/v1/payments/callback`,
            errorURL: `${process.env.SWAGER_SERVER}/api/v1/payments/callback`,
        }], '31642524321531642524321531642524')
    }

    async callMerchantAction(trandata: string): Promise<any> {
        return axios.post<any>('https://securepayments.alrajhibank.com.sa/pg/payment/tranportal.htm',
            [
                {
                    id: "r47ft9FN49qJTpS",
                    trandata,
                    responseURL: "https://merchantpage/PaymentResult.jsp",
                    errorURL: "https://merchantpage/PaymentResult.jsp"
                }
            ]
        )
    }

    aesEncryptInquiry(amount: string, trackId: string, transId: string) {
        return this.aesEncrypt([{
            amt: amount,
            action: "8",
            password: "e5#A@K$8daSu2L1",
            id: "r47ft9FN49qJTpS",
            currencyCode: process.env.CURRENCY_CODE,
            trackId: trackId,
            transId: transId,
            responseURL: `${process.env.SWAGER_SERVER}/api/v1/payments/callback`,
            errorURL: `${process.env.SWAGER_SERVER}/api/v1/payments/callback`,
        }], '31642524321531642524321531642524')
    }

    async callAction(trandata: string): Promise<any> {
        return axios.post<any>('https://securepayments.alrajhibank.com.sa/pg/payment/hosted.htm',
            [
                {
                    id: "r47ft9FN49qJTpS",
                    trandata,
                    responseURL: "https://merchantpage/PaymentResult.jsp",
                    errorURL: "https://merchantpage/PaymentResult.jsp"
                }
            ]
        )
    }

    async checkPayment(transId: string, trackId: string, hash: string, amount: number) {

        return axios.post<any>('https://payments-dev.urway-tech.com/URWAYPGService/transaction/jsonProcess/JSONrequest',
            {
                terminalId: process.env.URWAYTERMINALID,
                password: process.env.URWAYPASSWORD,
                transid: transId,
                trackid: trackId,
                requestHash: hash,
                country: "SA",
                currency: "SAR",
                action: 10,
                amount: amount.toFixed(2)
            })
    }

    async makePayment(trackId: string, amount: number, email: string, phone: string) {
        const payment = await this.urway.payment.create({
            referenceId: trackId, // trackid, in urway docs
            amount: amount.toFixed(2),
            customer: {
                email: email, // * Required field
                // firstName: "Johen",         // Optional field
                // lastName: "Doe",            // Optional field
                // address: "",                // Optional field
                // city: "",                   // Optional field
                // state: "",                  // Optional field
                // Zip: "",                    // Optional field
                phone: phone                // Optional field
            },
            // To determine the language of the payment page, you can use the following values: EN, AR (default is EN)
            lang: "AR", // Optional field
            // A parameter for you to keep any information corresponding to the transaction.
            udf1: "", // Optional field
            udf4: "", // Optional field
            // where your customer is going to be redirected after paying.
            redirectURL: `${process.env.SERVER}/api/v1/payments/callback`,
        });
        return payment;
    }

    async refundPayment(amount: number, paymentId: string, referenceId: string, hash: string) {
        return axios.post<any>('https://payments-dev.urway-tech.com/URWAYPGService/transaction/jsonProcess/JSONrequest',
            {
                terminalId: process.env.URWAYTERMINALID,
                password: process.env.URWAYPASSWORD,
                transid: paymentId,
                trackid: referenceId,
                requestHash: hash,
                action: 2,
                amount: amount.toFixed(2)
            })
    }

    aesEncrypt(trandata, key) {
        var iv = "PGKEYENCDECIVSPC";
        var rkEncryptionIv = aesjs.utils.utf8.toBytes(iv);
        var enckey = aesjs.utils.utf8.toBytes(key);
        var aesCtr = new aesjs.ModeOfOperation.cbc(enckey, rkEncryptionIv);
        var textBytes = aesjs.utils.utf8.toBytes(encodeURIComponent(JSON.stringify(trandata)));
        var encryptedBytes = aesCtr.encrypt(aesjs.padding.pkcs7.pad(textBytes));
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    }

    aesDecryption(encryptedHex, key) {
        var iv = "PGKEYENCDECIVSPC";
        var enckey = aesjs.utils.utf8.toBytes(key);
        var rkEncryptionIv = aesjs.utils.utf8.toBytes(iv);
        var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        var aesCbc = new aesjs.ModeOfOperation.cbc(enckey, rkEncryptionIv);
        var decryptedBytes = aesCbc.decrypt(encryptedBytes);
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        console.log(encodeURIComponent(decryptedText))
        return decryptedText
    }
}