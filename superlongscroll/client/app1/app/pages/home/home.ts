import {Page} from 'ionic-angular';
import {PeopleService} from '../../providers/people-service/people-service';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers:[PeopleService]
  
})
export class HomePage {
  public people:any = [];
  private start:number=0;
  
  constructor(public peopleService:PeopleService) {
    
    this.loadPeople();
  }
  
  loadPeople() {
    
    return new Promise(resolve => {
      
      this.peopleService.load(this.start)
      .then(data => {
        
        for(let person of data) {
          this.people.push(person);
        }
        
        resolve(true);
        
      });
            
    });

  }
  
  doInfinite(infiniteScroll:any) {
     console.log('doInfinite, start is currently '+this.start);
     this.start+=50;
     
     this.loadPeople().then(()=>{
       infiniteScroll.complete();
     });
     
  }

}
