import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../model/patient';
import { Gender } from '../model/patient';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  Gender = Gender;
  patients:  Array<Patient>;

  constructor(private  patientService:  PatientService, private router: Router){
  }

  ngOnInit(){
    this.fetchData();
  }

  fetchData(){
    this.patientService.fetch().subscribe((data:  Patient[])=>{
      this.patients  =  data;
    }, (err)=>{
      console.log(err);
      });
  }

  navigate(patient: Patient){
    this.router.navigate(['/detail', patient.id]);
  }

}
