import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

import { Patient, Gender } from './model/patient';
import { PatientFilter } from './model/patientFilter';

const numberOfPatients: number = 200;
const firstNamesMale: string[] = ['Bertus','Gerrit','Nicolaas','Hugo','Tom','Leo','Geert','Kris','Lucas','Matthias','Matteo'];
const firstNamesFemale: string[] = ['Annie','Virginie','Maria','Patricia','Ann','Kristien','Wendy','Isabelle','Anja','Mia','Suzanne'];
const lastNames: string[] = ['Peetermans','Peeters','Janssens','Beets','Loveling','Claus','Dewolf','Thijs','Lampo','Pauwels','Mortier','Nolens','Brouwers','Maes','Roggeman','Raes','Geerts','Brems','Timmermans','Streuvels','Rubens','Verhelst','Verhulst','Verhaegen','Zielens'];
const careServices: string[] = ['VP01','VP02','VP03','A510','A515','A520','A525','A610','A615','A620','A625'];
const beds: string[] = ['B1', 'B2'];
const pictureUrls: string[] = ["https://28.media.tumblr.com/tumblr_krvvxawUd81qa9hjso1_1280.jpg",  "https://24.media.tumblr.com/tumblr_krvv7wTHnB1qa9hjso1_1280.jpg",  "https://cdn2.thecatapi.com/images/4d.jpg",  "https://cdn2.thecatapi.com/images/bh.jpg",  "https://cdn2.thecatapi.com/images/eo.jpg",  "https://cdn2.thecatapi.com/images/fn.jpg",  "https://cdn2.thecatapi.com/images/hj.png",  "https://cdn2.thecatapi.com/images/i7.jpg",  "https://cdn2.thecatapi.com/images/jc.jpg",  "https://cdn2.thecatapi.com/images/ku.jpg",  "https://cdn2.thecatapi.com/images/lm.jpg",  "https://cdn2.thecatapi.com/images/lt.jpg",  "https://cdn2.thecatapi.com/images/md.jpg",  "https://cdn2.thecatapi.com/images/nt.jpg",  "https://cdn2.thecatapi.com/images/o7.jpg",  "https://cdn2.thecatapi.com/images/p5.jpg",  "https://cdn2.thecatapi.com/images/10b.jpg",  "https://cdn2.thecatapi.com/images/10s.jpg",  "https://cdn2.thecatapi.com/images/15v.jpg",  "https://cdn2.thecatapi.com/images/171.jpg",  "https://cdn2.thecatapi.com/images/196.gif",  "https://cdn2.thecatapi.com/images/1bs.jpg",  "https://cdn2.thecatapi.com/images/1dm.png",  "https://cdn2.thecatapi.com/images/1gu.png",  "https://cdn2.thecatapi.com/images/1kp.jpg",  "https://cdn2.thecatapi.com/images/1mt.jpg",  "https://cdn2.thecatapi.com/images/1pt.jpg",  "https://cdn2.thecatapi.com/images/1qt.jpg",  "https://cdn2.thecatapi.com/images/1rd.jpg",  "https://cdn2.thecatapi.com/images/1si.jpg",  "https://cdn2.thecatapi.com/images/1sk.jpg",  "https://cdn2.thecatapi.com/images/1tl.gif",  "https://cdn2.thecatapi.com/images/1uf.jpg",  "https://cdn2.thecatapi.com/images/1vd.png",  "https://cdn2.thecatapi.com/images/20i.jpg",  "https://cdn2.thecatapi.com/images/22r.png",  "https://cdn2.thecatapi.com/images/24e.jpg",  "https://cdn2.thecatapi.com/images/24k.jpg",  "https://cdn2.thecatapi.com/images/24t.jpg",  "https://cdn2.thecatapi.com/images/24u.jpg",  "https://cdn2.thecatapi.com/images/26c.jpg",  "https://cdn2.thecatapi.com/images/274.jpg",  "https://cdn2.thecatapi.com/images/29g.jpg",  "https://cdn2.thecatapi.com/images/29t.jpg",  "https://cdn2.thecatapi.com/images/2bl.jpg",  "https://cdn2.thecatapi.com/images/2c5.jpg",  "https://cdn2.thecatapi.com/images/2d8.jpg",  "https://cdn2.thecatapi.com/images/2f4.jpg",  "https://cdn2.thecatapi.com/images/2mh.jpg",  "https://cdn2.thecatapi.com/images/2oc.jpg",  "https://cdn2.thecatapi.com/images/2vc.jpg",  "https://cdn2.thecatapi.com/images/30e.jpg",  "https://cdn2.thecatapi.com/images/30i.jpg",  "https://cdn2.thecatapi.com/images/31h.jpg",  "https://cdn2.thecatapi.com/images/31p.jpg",  "https://cdn2.thecatapi.com/images/33t.gif",  "https://cdn2.thecatapi.com/images/340.gif",  "https://cdn2.thecatapi.com/images/380.jpg",  "https://cdn2.thecatapi.com/images/3dk.jpg",  "https://cdn2.thecatapi.com/images/3f6.jpg",  "https://cdn2.thecatapi.com/images/3hd.jpg",  "https://cdn2.thecatapi.com/images/3hh.jpg",  "https://cdn2.thecatapi.com/images/3ht.jpg",  "https://cdn2.thecatapi.com/images/3j4.jpg",  "https://cdn2.thecatapi.com/images/3j8.jpg",  "https://cdn2.thecatapi.com/images/3k4.gif",  "https://cdn2.thecatapi.com/images/3ml.jpg",  "https://cdn2.thecatapi.com/images/3ne.gif",  "https://cdn2.thecatapi.com/images/3ni.gif",  "https://cdn2.thecatapi.com/images/3oc.gif",  "https://cdn2.thecatapi.com/images/3oe.gif",  "https://cdn2.thecatapi.com/images/3pu.gif",  "https://cdn2.thecatapi.com/images/3r1.jpg",  "https://cdn2.thecatapi.com/images/3rb.jpg",  "https://cdn2.thecatapi.com/images/3t0.jpg",  "https://cdn2.thecatapi.com/images/3vm.jpg",  "https://cdn2.thecatapi.com/images/40b.jpg",  "https://cdn2.thecatapi.com/images/40g.jpg",  "https://cdn2.thecatapi.com/images/416.jpg",  "https://cdn2.thecatapi.com/images/41u.jpg",  "https://cdn2.thecatapi.com/images/43f.jpg",  "https://cdn2.thecatapi.com/images/43t.jpg",  "https://cdn2.thecatapi.com/images/44l.jpg",  "https://cdn2.thecatapi.com/images/47c.jpg",  "https://cdn2.thecatapi.com/images/49b.gif",  "https://cdn2.thecatapi.com/images/4ci.gif",  "https://cdn2.thecatapi.com/images/4d4.gif",  "https://cdn2.thecatapi.com/images/4dm.gif",  "https://cdn2.thecatapi.com/images/4eg.gif",  "https://cdn2.thecatapi.com/images/4eh.jpg",  "https://cdn2.thecatapi.com/images/4gd.gif",  "https://cdn2.thecatapi.com/images/4gg.gif",  "https://cdn2.thecatapi.com/images/4gm.gif",  "https://cdn2.thecatapi.com/images/4gu.gif",  "https://cdn2.thecatapi.com/images/4im.gif",  "https://cdn2.thecatapi.com/images/4lp.gif",  "https://cdn2.thecatapi.com/images/4o0.jpg",  "https://cdn2.thecatapi.com/images/4on.jpg",  "https://cdn2.thecatapi.com/images/4qm.gif",  "https://cdn2.thecatapi.com/images/4rk.jpg"];

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  allPatients: Patient[];

  constructor(private http: HttpClient) {
      this.allPatients = this.generatePatients();
  }

  fetchServices(): Observable<string[]>{
    return new Observable((observer) => {
      observer.next(careServices);
      observer.complete();
    });
  }

  fetch(filter?: PatientFilter): Observable<Patient[]>{

    let patients : Patient[] = [];

    if(!filter){
      patients = this.allPatients;
    } else {
      this.allPatients.forEach(patient => {
        if(this.isMatch(patient, filter)){
          patients.push(patient);
        }
      });
    }

    return new Observable((observer) => {
      observer.next(patients);
      observer.complete();
    });
   }

   isMatch(patient: Patient, filter: PatientFilter){
     if(filter.name && !patient.name.toUpperCase().includes(filter.name.toUpperCase())) return false;
     if(filter.doctorName && !patient.doctorName.toUpperCase().includes(filter.doctorName.toUpperCase())) return false;
     if(filter.services && !filter.services.includes(patient.service)) return false;

     return true;
   }

   findById(id: number): Observable<Patient>{
    return new Observable((observer) => {
      observer.next(this.allPatients.find(p => p.id == id));
      observer.complete();
    });
   } 

   private generatePatients(): Patient[]{
    let patients : Patient[] = [];
    for(let xx=0; xx < numberOfPatients; xx++){
     let patient = new Patient();
     
     patient.id = xx + 1;
     patient.sex = this.pickOne([Gender.Male, Gender.Female]);
     patient.name = this.pickName(patient.sex);
     patient.doctorName = this.pickOne(["Prof. Dr. ", "Dr. "]) + this.pickName(patient.sex);
     patient.age = this.randomInt(14, 99);
     patient.service = this.pickOne(careServices);
     patient.bed = this.pickOne(beds);
     patient.room = "K" + this.randomInt(1, 99);
     patient.pictureUrl = this.pickOne(pictureUrls);
     patient.address = this.pickOne(["Havermarkt 1, Hasselt","Wetstraat 6, 1000 Brussel", "Meir 7, Antwerpen", "Bondgenotenlaan 100, Leuven"]);
     patients.push(patient);
    }
    return patients;
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
