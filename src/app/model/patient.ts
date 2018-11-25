export enum Gender {Male, Female}

export class Patient {
  name: string;
  doctorName: string;
  service: string;
  room: string;
  bed: string;
  age: number;
  sex: Gender;
}
