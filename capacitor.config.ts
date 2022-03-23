import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.safmumapboxapp',
  appName: 'mapboxdemo',
  webDir: 'dist/mapboxdemo',
  bundledWebRuntime: false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0
    }
  }
};

export default config;
