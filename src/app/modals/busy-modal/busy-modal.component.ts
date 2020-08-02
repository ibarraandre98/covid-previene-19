import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-busy-modal',
  templateUrl: './busy-modal.component.html',
  styleUrls: ['./busy-modal.component.scss'],
})
export class BusyModalComponent implements OnInit {

  datos:any;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) 
  {
    this.datos = this.navParams.get('datos');
  }

  ngOnInit() {
    console.log(this.datos);

    let arrayBusy = this.datos.busyInfo.analysis.busy_hours;
    console.log(arrayBusy);
    arrayBusy.forEach(item => console.log(item));
  }

  dismissModal(){
    this.modalCtrl.dismiss();
  }
}
