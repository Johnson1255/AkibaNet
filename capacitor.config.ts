import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'internet.cafe',
  appName: 'internet-cafe',
  webDir: 'dist'
,
    android: {
       buildOptions: {
          keystorePath: '/home/nekstoreo/Workspace/akibanet.jks',
          keystoreAlias: 'akibanet',
          keystoreAliasPassword: 'akibanet',
          keystorePassword: 'akibanet'
       }
    }
  };

export default config;
