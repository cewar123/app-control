package com.anonymous.appcontrol;

import android.telephony.SmsManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class DirectSmsModule extends ReactContextBaseJavaModule {

    public DirectSmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "DirectSms";
    }

    @ReactMethod
    public void sendDirectSMS(String phoneNumber, String msg, Callback success, Callback error) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNumber, null, msg, null, null);
            success.invoke("SMS enviado exitosamente");
        } catch (Exception ex) {
            error.invoke("Error al enviar SMS: " + ex.getMessage());
        }
    }
}