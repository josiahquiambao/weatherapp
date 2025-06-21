import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OneCallWeather } from '../../models/weather.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherApiKey;  
  private geoApiKey = environment.geocodeapikey;
  private baseUrl = 'https://api.openweathermap.org/data/3.0';
  private geoUrl = 'https://api.openweathermap.org/geo/1.0';

  constructor(private http: HttpClient) {}

  getCoordinates(city: string) {
    return this.http.get(`${this.geoUrl}/direct`, {
      params: {
        q: city,
        limit: 1,
        appid: this.geoApiKey
      }
    });
  }

  getWeatherForecast(lat: number, lon: number): Observable<OneCallWeather> {
    return this.http.get<OneCallWeather>(`${this.baseUrl}/onecall`, {
      params: {
        lat,
        lon,
        exclude: 'minutely,alerts',
        units: 'metric',
        appid: this.apiKey
      }
    });
  }

  getCurrentWeather(lat: number, lon: number): Observable<OneCallWeather> {
    return this.http.get<OneCallWeather>(`${this.baseUrl}/onecall`, {
      params: {
        lat,
        lon,
        exclude: 'minutely,hourly,daily,alerts',
        units: 'metric',
        appid: this.apiKey
      }
    }).pipe(
      tap((data: OneCallWeather) => {
        this.applyWeatherTheme(data.current.weather[0].main);
      })
    );
  }

  private applyWeatherTheme(condition: string): void {
    const body = document.body;
    body.className = '';
    
    const lcCondition = condition.toLowerCase();
    if (lcCondition.includes('sun') || lcCondition.includes('clear')) {
      body.classList.add('sunny');
    } else if (lcCondition.includes('rain') || lcCondition.includes('storm')) {
      body.classList.add('rainy');
    } else if (lcCondition.includes('snow') || lcCondition.includes('blizzard')) {
      body.classList.add('snowy');
    } else if (lcCondition.includes('fog') || lcCondition.includes('mist')) {
      body.classList.add('foggy');
    } else if (lcCondition.includes('cloud')) {
      body.classList.add('cloudy');
    }
  }
}
