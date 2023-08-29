import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const secret = speakeasy.generateSecret({ length: 20 });

const qrCodeUrl = speakeasy.otpauthURL({
  secret: secret.base32,
  label: 'Your App',
  issuer: 'Your App',
});