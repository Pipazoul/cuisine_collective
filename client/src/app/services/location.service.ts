import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocationApiResponseClass } from '../domain/location-api-response.class';
import { map } from 'rxjs/operators';

@Injectable()
export class LocationService {

    private static readonly LOCATION_API_URL = 'https://api-adresse.data.gouv.fr/search/';
    private static readonly QUERY_PARAMETER = 'q';
    private static readonly LIMIT_PARAMETER = 'limit';

    constructor(private httpClient: HttpClient) {
    }

    search(queryString: string, limit: number): Observable<LocationApiResponseClass> {
        return this.httpClient.get<LocationApiResponseClass>(LocationService.LOCATION_API_URL, {
            params: new HttpParams()
                .set(LocationService.QUERY_PARAMETER, queryString)
                .set(LocationService.LIMIT_PARAMETER, limit.toString())
        }).pipe(map((res) => new LocationApiResponseClass(res)));
    }
}
