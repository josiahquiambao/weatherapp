# Mata Weather App (Web + Mobile)

A cross-platform weather application built with Angular that provides current weather conditions and forecasts for both web and mobile devices.

![App Screenshot](/assets/screenshot.png)

## Features

### Web & Mobile
- Current weather conditions
- 5-day weather forecast
- GitHub authentication
- Responsive design
- Location-based weather

### Mobile Specific
- Native device integration
- Offline capabilities
- Push notifications
- Installable PWA

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Angular CLI
- Auth0 account (for authentication)

## Installation

### Web Installation
1. Clone the repository:
```bash
git clone https://github.com/josiahquiambao/mata-weather-app.git
cd mata-weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```
Edit the environment.ts file with your Auth0 credentials.

4. Start the development server:
```bash
ng serve
```

### Mobile App Setup
1. Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

2. Add platforms:
```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

3. Build web assets:
```bash
ng build --configuration production
npx cap copy
```

4. Run on device:
```bash
npx cap open android
# or
npx cap open ios
```

## Project Structure

```
mata-weather-app/
├── src/                      # Web app source
│   ├── app/
│   │   ├── components/       # Shared components
│   │   ├── guards/           # Route guards
│   │   ├── services/         # Shared services
│   │   ├── models/           # Data models
│   │   └── app.routes.ts     # Application routes
│   ├── assets/               # Static assets
│   └── environments/          # Environment configs
├── android/                  # Android platform
├── ios/                      # iOS platform
├── angular.json              # Angular config
├── capacitor.config.json      # Mobile config
└── package.json              # Project dependencies
```
```

## Development

### Web Development
```bash
ng serve
```
The application will be available at `http://localhost:4200`

### Mobile Development
```bash
ng build --watch
npx cap copy
npx cap open android/ios
```

### Building for Production
```bash
# Web
ng build --configuration production

# Mobile
npx cap copy
npx cap sync
```

## Configuration

### Auth0 Setup (Web & Mobile)
1. Create an Auth0 account at https://auth0.com
2. Create a new Single Page Application
3. Configure allowed callback URLs:
   - http://localhost:4200/callback
   - my.app://callback (for mobile)
4. Configure allowed logout URLs:
   - http://localhost:4200
   - my.app://logout

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

### Web Deployment
The app can be deployed to:
- Vercel
- Netlify
- Firebase Hosting
- AWS Amplify

### Mobile Deployment
1. Android:
```bash
npx cap build android
```
2. iOS:
```bash
npx cap build ios
```
3. PWA:
```bash
ng add @angular/pwa
ng build --configuration production
```

See Angular and Capacitor documentation for more details.
