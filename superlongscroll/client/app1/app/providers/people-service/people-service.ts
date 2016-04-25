import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PeopleService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PeopleService {

  perpage:number = 50;
  
  constructor(public http: Http) {}

  load(start:number=0) {

    return new Promise(resolve => {
      
      this.http.get('http://192.168.4.13:3000/api/people?filter[limit]='+this.perpage+'&filter[skip]='+start)
        .map(res => res.json())
        .subscribe(data => {

          resolve(data);

        });
    });
  }
}

