import { Component, OnInit, OnDestroy } from '@angular/core';
import { Patient } from '../model/patient';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient.service';
import { MapService } from '../map.service';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  patient: Patient;
  sub: any;
  lat: number = 50.9;
  lng: number = 4.4;
  hasChanges: boolean = false;
  serviceControl = new FormControl();
  roomControl = new FormControl();
  bedControl = new FormControl();

  constructor(private  patientService:  PatientService, 
              private mapService: MapService,
              private router: Router, 
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.patientService.findById(id).subscribe(p => {
        this.patient = p;
        this.serviceControl.setValue(this.patient.service);
        this.roomControl.setValue(this.patient.room);
        this.bedControl.setValue(this.patient.bed);
      })
   });

  }

  onPictureSelected(event){
    console.log("picture selected");
    console.log(event);
  }

  detectChanges(event){
    this.hasChanges = !(this.patient.service == this.serviceControl.value
                        && this.patient.room == this.roomControl.value
                        && this.patient.bed == this.bedControl.value);
  }

  saveChanges(event){
    this.patient.service = this.serviceControl.value;
    this.patient.room = this.roomControl.value;
    this.patient.bed = this.bedControl.value;

    //TODO: save changes to back-end

    this.hasChanges = false;
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  getLocation(location) {
    this.mapService.getGeocodeLocation(location).subscribe(
      (coordinates: any) => {
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
        // console.log(coordinates.lat);
        // console.log(coordinates.lng);
      }, (error: string) => {
        console.error(error);
      });
  }

  mapReadyHandler() {
  	this.getLocation(this.patient.address);
}

}
