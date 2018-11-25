import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

import { Patient, Gender } from './model/patient';

const numberOfPatients: number = 200;
const firstNamesMale: string[] = ['Bertus','Gerrit','Nicolaas','Hugo','Tom','Leo','Gert','Kris','Lucas','Matthias','Matteo'];
const firstNamesFemale: string[] = ['Annie','Virginie','Maria','Patricia','Ann','Kristien','Wendy','Isabelle','Anja','Mia','Suzanne'];
const lastNames: string[] = ['Peetermans','Peeters','Janssens','Beets','Loveling','Clause','Dewolf','Thijs','Lampo','Pauwels','Mortier','Nolens','Brouwers','Maes','Roggeman','Raes','Geerts','Brems','Timmermans','Streuvels','Rubens','Verhelst','Verhulst','Verhaegen','Zielens'];
const careServices: string[] = ['VP01','VP02','VP03','A510','A515','A520','A525','A610','A615','A620','A625'];
const beds: string[] = ['B1', 'B2'];

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {

   }

  fetch(): Observable<Patient[]>{
     let patients : Patient[] = [];
     for(let xx=0; xx < numberOfPatients; xx++){
      let patient = new Patient();
      
      patient.sex = this.pickOne([Gender.Male, Gender.Female]);
      patient.name = this.pickName(patient.sex);
      patient.doctorName = "Prof. Dr. " + this.pickName(patient.sex);
      patient.age = this.randomInt(14, 99);
      patient.service = this.pickOne(careServices);
      patient.bed = this.pickOne(beds);
      patient.room = "K" + this.randomInt(1, 99);
      patients.push(patient);
     }

    return new Observable((observer) => {
      observer.next(patients);
      observer.complete();
    });
   }

   private pickName(gender: Gender){
     return this.pickOne(gender == Gender.Female ? firstNamesFemale : firstNamesMale)  + " " + this.pickOne(lastNames);
   }

  private pickOne(list: any[]){
    return list[this.randomInt(0, list.length-1)];
  }

  private randomInt(min, max) : number{
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}