export enum Gender {Male, Female}

export class Patient {
  id: number;
  name: string;
  doctorName: string;
  service: string;
  room: string;
  bed: string;
  age: number;
  sex: Gender;
}
