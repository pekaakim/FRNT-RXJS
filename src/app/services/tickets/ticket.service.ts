import { Injectable } from '@angular/core';
import {TicketRestService} from "../rest/ticket-rest.service";
import {map, Observable, Subject} from "rxjs";
import {ICustomTicketData, INearestTour, ITour, ITourLocation} from "../../models/tours"
import {ITourTypeSelect} from "../../models/tours";

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private ticketServiceRest: TicketRestService) { }

  private ticketSubject = new Subject<ITourTypeSelect>()


  // 1 var Observable
  readonly ticketType$ = this.ticketSubject.asObservable();

  // 2 var Observable
  // getTicketTypeObservable(): Observable<ITourTypeSelect> {
  //   return this.ticketSubject.asObservable();
  // }

 updateTour(type:ITourTypeSelect): void {
   this.ticketSubject.next(type);
  }

  //Method ticketServiceRest
  getTickets(): Observable<ITour[]>{
   //return Observable, add single tours
    return this.ticketServiceRest.getTickets().pipe(map(
      
      (value) => {
        const singleTour = value.filter((el) => el.type === "single")
        return value.concat(singleTour)
      }
    ));
  }
  
   getError(): Observable<any> {
    return this.ticketServiceRest.getRestError()
   }

   getNearestTours(): Observable<INearestTour[]>{
   return this.ticketServiceRest.getNearestTickets()
   }

   getToursLocation(): Observable<ITourLocation[]>{
   return this.ticketServiceRest.getLocationList()
}

   transformData (data: INearestTour[], regions: ITourLocation[]): ICustomTicketData[]{
     const newTicketData: ICustomTicketData[] = [];
     data.forEach((el) => {
       const newEl = <ICustomTicketData> {...el};
       newEl.region = <ICustomTicketData>regions.find((region) => el.locationId === region.id) || {};
       newTicketData.push(newEl);
     });
     return newTicketData;
   }
  getRandomNearestEvent(type: number): Observable<INearestTour>{
   return this.ticketServiceRest.getRandomNearestEvent(type);
  }
  sendTourData(data: any): Observable<any> {
    return this.ticketServiceRest.sendTourData(data);
  }



}
