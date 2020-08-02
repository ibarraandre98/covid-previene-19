import {Marker} from './../interfaces/marker';
import {BusyModalComponent} from './../modals/busy-modal/busy-modal.component';
import {BesttimeServiceService} from './../services/besttime-service.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Component, Input} from '@angular/core';
import {LoadingController, ModalController, AlertController} from '@ionic/angular';
import {mapToMapExpression} from '@angular/compiler/src/render3/util';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

declare var google;

@Component({selector: 'app-home', templateUrl: 'home.page.html', styleUrls: ['home.page.scss']})
export class HomePage {

    mapRef = null;
    mapEle = null;

    constructor(private geolocation : Geolocation,
      private loadCtrl : LoadingController,
      private besttimeService : BesttimeServiceService,
      private modalCtrl : ModalController,
      private locationAccuracy: LocationAccuracy,
      private alertController: AlertController,
          ) {}

    ngOnInit() {
        this.loadMap();
        console.log(google.maps);
        this.search();
        this.enableLocation();
    }

    enableLocation(){
        
      // the accuracy option will be ignored by iOS
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          console.log('Request successful')
        },
        error => {
          console.log('Error requesting location permissions', error)
        }
      );
  }

  async showAlert(title: string, content: string) {
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ["Ok"],
    });

    await alert.present();
  }


    async loadMap() {

        const loading = await this.loadCtrl.create({
          message:'Cargando, verificando si su ubicación está activa',
          spinner:'crescent'
        });
        loading.present();
        const myLatLng = await this.getLocation();
        this.mapEle = document.getElementById('map');
        this.mapRef = new google.maps.Map(this.mapEle, {
            center: myLatLng,
            zoom: 12
        });

        let newMarker: Marker = new google.maps.Marker({
            position: {
                lat: myLatLng.lat,
                lng: myLatLng.lng
            },
            title: 'Mi ubicación'
        });

        google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
            loading.dismiss();
            this.addMaker(newMarker);
        });
        this.clickMarker();
    }

    private addMaker(marker : Marker) {
        const newMarker = new google.maps.Marker({position: marker.position, map: this.mapRef, title: marker.title});
        newMarker.addListener('click', () => {
            this.mapRef.setZoom(8);
            this.mapRef.setCenter(newMarker.getPosition());
            console.log(newMarker);
        });
        return newMarker;
    }

    private async getLocation() {
        const gcp = await this.geolocation.getCurrentPosition();
        console.log(gcp);
        const myLatLng = {
            lat: gcp.coords.latitude,
            lng: gcp.coords.longitude
        }
        console.log(myLatLng);
        return myLatLng;
    }

    async search() {
        const searchBox = await new google.maps.places.SearchBox(document.getElementById('mapsearch'));
        const marker = new google.maps.Marker();
        google.maps.event.addListener(searchBox, 'places_changed', () => {
            let places = searchBox.getPlaces();
            console.log('muski');
            let bounds = new google.maps.LatLngBounds();
            let place;
            for (let i = 0; place = places[i]; i++) {
                bounds.extend(place.geometry.location);
                let positions = JSON.stringify(place.geometry.location);
                let positionsParse = JSON.parse(positions);
                let lugarString = JSON.stringify(place);
                let lugarParse = JSON.parse(lugarString);
                let newMarker: Marker = {
                    position: {
                        lat: positionsParse.lat,
                        lng: positionsParse.lng
                    },
                    title: lugarParse.name
                }
                this.addMaker(newMarker);
                console.log(lugarParse);
                console.log(lugarParse.name + ' ' + lugarParse.formatted_address);
                this.createForecast(lugarParse.name, lugarParse.formatted_address);
            }
            this.mapRef.fitBounds(bounds);
            this.mapRef.setZoom(15);
        });
    }

    createForecast(name, adress) { /* Crea el forecast y me retorna el venue_id del lugar */
        this.besttimeService.createForecast(name, adress).subscribe(response => {
            console.log(response);
            this.besttimeService.getBusyHours(response.venue_info.venue_id)
            .subscribe(busy => {
                let datosLugar = {
                    'nombreLugar': name,
                    'direccionLugar': adress,
                    'busyInfo': busy
                }
                this.openBusyModal(datosLugar);
            },
            err => console.log(err)
            );

            /* Para obtener las horas ocupadas de todos los días */
            /* response.analysis.forEach(res => {
        console.log(res);
        res.busy_hours.forEach(res => { console.log(res)});
      }); */
        },err => this.showAlert('Error','No hay datos para esta ubicación y/o dirección'));
    }

    async openBusyModal(datos) {
        const modal = await this.modalCtrl.create({
          component: BusyModalComponent, 
          componentProps: {
                datos,
              }
              });
        await modal.present();
    }

    clickMarker() {
        this.mapRef.addListener('click',async e => {
          const loading = await this.loadCtrl.create();
            loading.present();
            console.log(e.placeId);
            const request = {
                placeId: e.placeId,
                fields: ['name', 'rating', 'formatted_phone_number','geometry', 'formatted_address']
            };
            const service = new google.maps.places.PlacesService(this.mapRef);
            service.getDetails(request, service => {
              console.log(service);
              this.createForecast(service.name, service.formatted_address);
              loading.dismiss();
            });
        });
        
    }

}
