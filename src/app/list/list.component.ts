import { Component, OnInit, Inject } from '@angular/core';
import {Router} from '@angular/router';
import { HostListener } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { PatientService } from '../patient.service';
import { Patient, Gender } from '../model/patient';
import { PatientFilter } from '../model/patientFilter';
import { FormControl } from '@angular/forms';

const PATIENTS_PER_PAGE : number = 20;
const MAX_PATIENTS = 200;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  Gender = Gender;
  patients:  Array<Patient>;
  pages: number = 1;
  patientFilter = new PatientFilter();

  constructor(public dialog: MatDialog,
              private  patientService:  PatientService, 
              private router: Router){
                console.log("constructor");
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(PatientFilterDialog, {
      width: '300px',
      data: this.patientFilter
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.patientFilter = result;
      this.fetchData();
    });
  }

  ngOnInit(){
    this.fetchData();
  }

  fetchData(){
    this.patientService.fetch(this.patientFilter).subscribe((data:  Patient[])=>{
      this.patients  =  data.slice(0, this.pages * PATIENTS_PER_PAGE);
    }, (err)=>{
      console.log(err);
    });
  }

  navigate(patient: Patient){
    this.router.navigate(['/detail', patient.id]);
  }


  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    let scrollPercentage: number = Math.round((pos/max) *100);
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if(scrollPercentage > 90 )   {
      this.addPage();
      this.fetchData();
    }
  }

  addPage(){
    let maxPages = MAX_PATIENTS / PATIENTS_PER_PAGE;
    if(this.pages < maxPages){
      this.pages++;
    }
  }

  onCardPan(event){ 
    //console.log(event);
    console.log(event.center.x + " - " + event.deltaX);
    console.log(event.target);
    console.log(event.target.style.marginLeft);
    event.target.style.marginLeft = event.deltaX;
  }

}

@Component({
  selector: 'patient-filter-dialog',
  templateUrl: 'patient-filter-dialog.html',
})
export class PatientFilterDialog {

  services: string[];

  constructor(
    public dialogRef: MatDialogRef<PatientFilterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PatientFilter,
    patientService: PatientService){
      patientService.fetchServices().subscribe((answer:  string[])=>{
        this.services  =  answer;
        console.log(this.services);
      }, (err)=>{
        console.log(err);
      });
    }

    onCancel(): void {
      this.dialogRef.close();
    }
}
