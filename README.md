### Instalação ###
npx create-expo-app --template bare-minimum myproject
ESCOLHA A VERSÃO SDK 54!!!

### Após instalar ###
rmdir /s /q node_modules <br>
del package-lock.json
npm install

### Modificar Package.json ###
{
  "name": "notifications",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-asset": "~11.0.4",
    "expo-constants": "~17.0.8",
    "expo-device": "~7.0.3",
    "expo-notifications": "~0.29.14",
    "expo-status-bar": "~2.0.1",
    "react": "18.3.1",
    "react-native": "0.76.9"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2"
  },
  "private": true
}
