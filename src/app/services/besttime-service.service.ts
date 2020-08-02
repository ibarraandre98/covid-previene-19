import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class BesttimeServiceService {


  apiKeyPublic = 'pub_f9c58ad3dd414040b0721ca7e816971b';
  apiKeyPrivate = 'pri_a63f9860eb2542cc9bdc4f22124ed2f1';

    constructor(private http : HttpClient,) {}

    getApiInfo() {
        return this.http.get('https://besttime.app/api/v1/keys/pri_a63f9860eb2542cc9bdc4f22124ed2f1');
    }

    createForecast(name, adress):Observable<any>{
      const url = 'https://besttime.app/api/v1/forecasts?api_key_private=' + this.apiKeyPrivate + '&venue_address=' + adress + '&venue_name='+ name;

      const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      .set('Access-Control-Allow-Methods', 'GET, POST, PUT');

      const params = new HttpParams()
      .append('api_key_private', this.apiKeyPrivate)
      .append('venue_address', 'Rio Mante 1507 Unión Burocrática Sector 1 89868 Cd Mante, Tamps. Mexico')
      .append('venue_name', 'Hula Gula');


      let datos = {
        'api_key_private': this.apiKeyPrivate,
        'venue_name': 'Hula Gula',
        'venue_address': 'Rio Mante 1507 Unión Burocrática Sector 1 89868 Cd Mante, Tamps. Mexico'
      }

      return this.http.post(url,null);
    }

    getVenue(){
      
      const urlVenueID = 'https://besttime.app/api/v1/venues/ven_6f373335546e435747494752594965343649483176614a4a496843';
      const urlAllVenues = 'https://besttime.app/api/v1/venues';
      const paramsVenueID = new HttpParams().append('api_key_public', 'pub_f9c58ad3dd414040b0721ca7e816971b');
      const params = new HttpParams().append('api_key_private', 'pri_50990bf1f8828f6abbf6152013113c6b');
      return this.http.get(urlAllVenues, {params});
    }

    getWeekForecast(){
      const url = 'https://besttime.app/api/v1/forecasts/week';
      let apiKeyPublic = 'pub_f9c58ad3dd414040b0721ca7e816971b';
      
      const params = new HttpParams()
      .append('api_key_public', this.apiKeyPublic)
      .append('venue_id', 'ven_6f373335546e435747494752594965343649483176614a4a496843');

      return this.http.get(url, {params});
    }

    getBusyHours(venueID){
      const url = 'https://besttime.app/api/v1/forecasts/busy';
      const params = new HttpParams()
      .append('api_key_public', this.apiKeyPublic)
      .append('venue_id', venueID);

      return this.http.get(url, {params});
    }

    /* No es posible hacer llamadas a Google maps api desde javascript */
    /* getInfoPlace(placeId){
      const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyA2NGZwx-ZfFIYu3_vpYDQ_e72xSA-sr7s';

      const params = new HttpParams()
      .append('placeid',placeId)
      .append('key','AIzaSyA2NGZwx-ZfFIYu3_vpYDQ_e72xSA-sr7s');

      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=UTF-8');

      return this.http.get(url, {headers});
    } */

}
