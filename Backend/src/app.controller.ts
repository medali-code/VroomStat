import { Controller, Get } from '@nestjs/common';
import * as  aesjs from 'aes-js';

@Controller()
export class AppController {

  constructor() {
  }

  @Get()
  findOne() {
    return this.aesEncrypt([{
      amt: "12.00",
      action: "1",
      password: "e5#A@K$8daSu2L1",
      id: "r47ft9FN49qJTpS",
      currencyCode: "682",
      trackId: Math.floor(Math.random() * 100000).toString(),
      responseURL: `${process.env.SWAGER_SERVER}/api/v1/payments/callback`,
      errorURL: `${process.env.SWAGER_SERVER}/api/v1/payments/callback`,
    }], '31642524321531642524321531642524')
  }

  @Get('decrypt')
  decrypt() {
    return this.aesDecryption('f3c2373a8839a59816ede036d9277abfcd754b92769b4ad490365f09127c1239b25939e75ef1c518a7e47f7229eb329572e2c2443745d11d002e2781c5ce03c7382be4f727b4818c05ffefe62412531ce671bb22f74a7d1a7080378d7157212435ccf793476cf4cb07dc7c268f4e9ae92138748b0802bd2438d3faaac20aa8c57456570f87fb0e70a5abf91a7ea9b4fd0673e664e826f3c9619feaa88f8e9e2a0059d8bda341c6b4907ae6926d6bbc437e47cb89e6c6dfde97d529ebbe985d1d8f673f0680606756a09b1e68d5a4d66eda893afb4794220af973c8302899a2bdbe1da148b530ae7906436eb3e5762ea6019fa31e1a98d8060a2b602e182ca8d9c8dd268f3dcef087e294522b66e52ed635b7348057bc7fa2e60415683c8accdd24986a6c0d4e8908eb2c260d0f2133a42e20cd2f7038c623dee6038d734eb811071cbfb3da682288e72014171f0eb53ab0a6eff4cc44461d17c4e99de9b6fd0d', '31642524321531642524321531642524')
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