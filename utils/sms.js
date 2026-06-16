import { NativeModules, Platform, PermissionsAndroid, Linking } from 'react-native';

const { SmsModule, DirectSms } = NativeModules;

export async function sendSMS(phoneNumber, message) {
  if (Platform.OS !== 'android') {
    throw new Error('SMS solo disponible en Android');
  }

  // 1. Intenta módulo nativo SmsManager (background)
  const hasSmsModule = !!SmsModule;
  const hasDirectSms = !!DirectSms;

  if (hasSmsModule) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await SmsModule.sendSMS(phoneNumber, message);
        return { success: true, method: 'background' };
      }
    } catch (e) {
      console.warn('SmsModule falló:', e.message);
    }
  }

  // 2. Fallback: DirectSms (si existe)
  if (hasDirectSms) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await new Promise((resolve, reject) => {
          DirectSms.sendDirectSMS(phoneNumber, message, resolve, reject);
        });
        return { success: true, method: 'direct' };
      }
    } catch (e) {
      console.warn('DirectSms falló:', e.message);
    }
  }

  // 3. Último recurso: Intent (abre app SMS)
  const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
    return { success: true, method: 'intent' };
  }

  throw new Error('No se pudo enviar SMS');
}