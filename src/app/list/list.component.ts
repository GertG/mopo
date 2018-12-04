import { Component, OnInit, Inject } from '@angular/core';
import {Router} from '@angular/router';
import { HostListener } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import { PatientService } from '../patient.service';
import { Patient, Gender } from '../model/patient';
import { PatientFilter } from '../model/patientFilter';
import { FormControl } from '@angular/forms';

const PATIENTS_PER_PAGE : number = 20;
const MAX_PATIENTS = 200;
const DRAG_PERCENTAGE_TO_DISCHARGE_PATIENT = 30;

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
  cardPositions: Map<number, number>;

  constructor(public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private  patientService:  PatientService, 
              private router: Router){
                console.log("constructor");
  }

  showMessage(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
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
      this.resetPositions();      
    }, (err)=>{
      console.log(err);
    });
  }

  resetPositions(){
    this.cardPositions = new Map<number, number>();    
    this.patients.forEach(p => {
      this.cardPositions[p.id] = 0;
      console.log(this.cardPositions[p.id]);
    });      
  }

  cardClicked(patient: Patient){

console.log("clicked " + patient.id);
console.log("which is at position " + this.cardPositions[patient.id])

    //don't allow navigation to patient while
    //we're draging their card
    if(this.cardPositions[patient.id] == 0){
      console.log("navigating");
      this.navigate(patient);
    }
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

  onCardPan(event, patient){ 
    console.log(event.deltaX);
    //move the card, but never off to the left side
    this.cardPositions[patient.id] = Math.max(0, event.deltaX);
  }

  onCardRelease(event, patient){    

    //if the card has been dragged
    //far enough,  check out the patient,
    //otherwise reposition the card

    let offset: number = Math.abs(this.cardPositions[patient.id]);
    let w = window.innerWidth;
    let percentage = Math.round((offset/w)*100);

    if(percentage > DRAG_PERCENTAGE_TO_DISCHARGE_PATIENT){
      this.dischargePatient(patient);
    }

    this.cardPositions[patient.id] = 0;

    event.preventDefault();
  }

  dischargePatient(patient: Patient){
    this.patients = this.patients.filter(obj => obj.id !== patient.id);
    this.showMessage('Uitgecheckt: ' + patient.name);
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
