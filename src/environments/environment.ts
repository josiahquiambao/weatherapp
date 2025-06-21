/**
 * Environment configuration for development and production
 * 
 * @warning Never commit actual API keys to version control in production
 * @remarks Create environment.prod.ts for production with actual values
 * 
 * Auth0 Configuration:
 * 1. Create Auth0 account at https://auth0.com
 * 2. Configure GitHub connection in Auth0 dashboard
 * 3. Add callback/logout URLs exactly as shown below
 */
export const environment = {
  production: false,
  
  /**
   * Auth0 authentication configuration
   */
  auth0: {
    domain: 'dev-1eegizrezvf8n8k0.us.auth0.com',
    clientId: 'Ix5xkU9omBIy08TQnxXRItbMl99XlGU2',
    callbackPath: '/callback',
    callbackUrl: 'http://localhost:4200/callback',
    logoutRedirectUrl: 'http://localhost:4200'
  },

  /**
   * @warning Replace with your actual OpenWeather API key
   * Get key at: https://openweathermap.org/api
   */
  openWeatherApiKey: 'e7b8404167e8b417560bc86d70e3564a',

  /**
   * @warning Replace with your actual Geocode API key
   * Get key at: https://positionstack.com/
   */
  geocodeapikey: 'a75fe4f35248bceaab4e4d6bab1ccc40'
};
