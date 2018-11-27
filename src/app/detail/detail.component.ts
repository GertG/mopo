import { Component, OnInit, OnDestroy } from '@angular/core';
import { Patient } from '../model/patient';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  patient: Patient;
  sub: any;

  constructor(private  patientService:  PatientService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = +params['id']; // (+) converts string 'id' to a number
      this.patientService.findById(id).subscribe(p => {
        this.patient = p;
      })
   });

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
