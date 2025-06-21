import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { OneCallWeather, HourlyWeather } from '../../../models/weather.model';

/**
 * Weather display component showing detailed weather information
 * 
 * @remarks
 * Features:
 * - Current weather conditions
 * - Hourly forecast (24 hours)
 * - Weather metrics (wind, humidity, etc.)
 * - Dynamic background based on weather conditions
 * 
 * @note Uses OpenWeather One Call API 3.0
 */
@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  /** Current weather data */
  weatherData: any = null;
  
  /** Hourly forecast array (24 hours) */
  hourlyForecast: any[] = [];
  
  /** Current weather conditions metrics */
  currentConditions: any[] = [];
  
  /** Loading state */
  loading = true;
  
  /** Dynamic background class based on weather */
  weatherBackgroundClass = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  /**
   * Initialize component and load weather data
   */
  ngOnInit() {
    const city = this.route.snapshot.paramMap.get('city') || '';
    this.loadWeatherData(city);
  }

  /**
   * Navigate back to home page
   */
  goBack() {
    this.router.navigate(['/home']);
  }

  /**
   * Load weather data for specified city
   * @param city - City name to get weather for
   */
  loadWeatherData(city: string) {
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
              console.error('Failed to load weather data:', err);
              this.loading = false;
            }
          });
        }
      },
      error: (err: any) => {
        console.error('Failed to geocode location:', err);
        this.loading = false;
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

    this.weatherData = {
      city: data.timezone.split('/')[1],
      temp: Math.round(data.current.temp),
      condition: condition,
      feelsLike: Math.round(data.current.feels_like)
    };

    this.currentConditions = [
      { label: 'Wind', value: data.current.wind_speed, unit: 'km/h', icon: 'fa-wind' },
      { label: 'Humidity', value: data.current.humidity, unit: '%', icon: 'fa-tint' },
      { label: 'Pressure', value: data.current.pressure, unit: 'hPa', icon: 'fa-tachometer-alt' },
      { label: 'UV Index', value: data.current.uvi, unit: '', icon: 'fa-sun' },
      { label: 'Dew Point', value: Math.round(data.current.dew_point), unit: '°', icon: 'fa-droplet' },
      { label: 'Visibility', value: data.current.visibility / 1000, unit: 'km', icon: 'fa-eye' }
    ];

    this.hourlyForecast = data.hourly.slice(0, 24).map((hour: HourlyWeather) => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }),
      temp: Math.round(hour.temp),
      condition: hour.weather[0].main
    }));
  }

  /**
   * Get Font Awesome icon class for weather condition
   * @param condition - Weather condition (e.g. 'Rain', 'Clear')
   * @returns Corresponding icon class
   */
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

  /**
   * Map weather condition to background class
   * @param condition - Weather condition
   * @returns Background class name
   */
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
      default:
        return 'default-bg';
    }
  }
}
