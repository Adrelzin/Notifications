### Instalação ###
npx create-expo-app --template bare-minimum myproject <br>
ESCOLHA A VERSÃO SDK 54!!! <br>
<img width="553" height="73" alt="image" src="https://github.com/user-attachments/assets/80262232-d253-4585-8d0b-1aefb74e8375" /> <br>
Desinstale a versão da PlayStore do expo go e instale o arquivo apk ⬇ <br>
https://drive.google.com/file/d/160LoXuScv1VpmCG5JswW3urcbe824lt9/view?usp=drive_link <br>
(Baixei do site oficial do expo go, n tem virus não)


### Após instalar ###
rmdir /s /q node_modules <br>
del package-lock.json <br>
npm install --force

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

<br> Dá um Alt+Shift+f <br>
