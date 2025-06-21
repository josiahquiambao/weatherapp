import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { AuthService } from '../../services/auth.service';
import { OneCallWeather, DailyWeather } from '../../../models/weather.model';

/**
 * Home component displaying weather dashboard
 * 
 * @remarks
 * Features:
 * - Weather search functionality
 * - Current weather display
 * - 5-day forecast
 * - User profile integration
 * 
 * @note Uses OpenWeather API for weather data
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** Current authenticated user */
  user: any = null;
  
  /** Search input value */
  searchQuery = '';
  
  /** Current weather data */
  currentWeather: any = null;
  
  /** 5-day forecast data */
  forecast: any[] = [];
  
  /** Loading state */
  loading = true;
  
  /** Error message */
  errorMessage = '';

  constructor(
    private weatherService: WeatherService,
    private authService: AuthService
  ) {}

  /**
   * Initialize component and subscribe to user state
   */
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.fetchWeather('Philippines');
  }

  /**
   * Trigger weather search based on input
   */
  searchWeather() {
    if (this.searchQuery.trim()) {
      this.fetchWeather(this.searchQuery);
    }
  }

  /**
   * Fetch weather data for specified city
   * @param city - City name to search
   */
  fetchWeather(city: string) {
    this.loading = true;
    this.errorMessage = '';

    this.weatherService.getCoordinates(city).subscribe({
      next: (geoData: any) => {
        if (geoData && geoData.length > 0) {
          const { lat, lon } = geoData[0];
          
          this.weatherService.getWeatherForecast(lat, lon).subscribe({
            next: (data: OneCallWeather) => {
              this.processWeatherData(data);
              this.loading = false;
            },
            error: (err: any) => {
              this.handleError('Failed to load weather data');
            }
          });
        } else {
          this.handleError('Location not found');
        }
      },
      error: (err: any) => {
        this.handleError('Failed to geocode location');
      }
    });
  }
  
  /**
   * Process raw weather data into display format
   * @param data - Raw weather data from API
   */
  private processWeatherData(data: OneCallWeather) {
  const condition = data.current.weather[0].main;

  this.weatherBackgroundClass = this.mapConditionToBackground(condition);

  this.currentWeather = {
    temp: Math.round(data.current.temp),
    condition: condition,
    city: this.searchQuery || data.timezone.split('/')[1],
    country: data.timezone.split('/')[0],
    wind: data.current.wind_speed,
    humidity: data.current.humidity,
    pressure: data.current.pressure,
    feelsLike: Math.round(data.current.feels_like)
  };

  this.forecast = data.daily.slice(0, 5).map((day: DailyWeather) => ({
    day: new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' }),
    high: Math.round(day.temp.max),
    low: Math.round(day.temp.min),
    condition: day.weather[0].main
  }));
}


  getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      'Clear': 'fa-sun',
      'Clouds': 'fa-cloud',
      'Rain': 'fa-cloud-rain',
      'Snow': 'fa-snowflake',
      'Thunderstorm': 'fa-bolt',
      'Drizzle': 'fa-cloud-rain',
      'Mist': 'fa-smog',
      'Smoke': 'fa-smog',
      'Haze': 'fa-smog',
      'Dust': 'fa-smog',
      'Fog': 'fa-smog',
      'Sand': 'fa-smog',
      'Ash': 'fa-smog',
      'Squall': 'fa-wind',
      'Tornado': 'fa-tornado'
    };
    return icons[condition] || 'fa-cloud';
  }

  private handleError(message: string) {
    this.errorMessage = message;
    this.loading = false;
    this.currentWeather = null;
    this.forecast = [];
  }
  weatherBackgroundClass = '';



private mapConditionToBackground(condition: string): string {
  switch (condition) {
    case 'Rain':
    case 'Drizzle':
    case 'Thunderstorm':
      return 'rainy-bg';
    case 'Snow':
      return 'snowy-bg';
    case 'Fog':
    case 'Mist':
    case 'Haze':
      return 'foggy-bg';
    case 'Clear':
      return 'sunny-bg'; 
    case 'Clouds':
      return 'cloudy-bg';
    default:
      return 'default-bg';
  }
}

}
