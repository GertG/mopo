import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../model/patient';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  patients:  Array<Patient>;

  constructor(private  patientService:  PatientService){
  }

  ngOnInit(){
    this.fetchData();
  }

  fetchData(){
    this.patientService.fetch().subscribe((data:  Patient[])=>{
      console.log(data);
      this.patients  =  data;
    }, (err)=>{
      console.log(err);
      });
  }


}
