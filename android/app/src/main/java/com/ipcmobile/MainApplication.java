package com.ipcmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {
    @Override
    public boolean isDebug() {
         // Make sure you are using BuildConfig from your own application
         return BuildConfig.DEBUG;
     }
     /*
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }*/

    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new WebRTCModulePackage(),
            new VectorIconsPackage(),
            new RNSensitiveInfoPackage(),
            new ReactNativePushNotificationPackage(),
            new InCallManagerPackage(),
            new ReactNativeContacts()
      );
    }


  @Override
     public List<ReactPackage> createAdditionalReactPackages() {
         return getPackages();
     }


     @Override
     public String getJSMainModuleName() {
       return "index";
     }
}
