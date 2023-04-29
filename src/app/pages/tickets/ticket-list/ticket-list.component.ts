import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TicketService} from "../../../services/tickets/ticket.service";
import {ITour, ITourTypeSelect} from "../../../models/tours";
import { ActivatedRoute, Router} from "@angular/router";
import {TiсketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {BlockStyleDirective} from "../../../directive/block-style.directive";
import {debounceTime, fromEvent, Subscription} from "rxjs";
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  tickets: ITour[];
  ticketsCopy: ITour[];
  renderComplete = false;
  private tourUnsubscriber: Subscription

  @ViewChild('tourWrap', {read: BlockStyleDirective}) blockDirective: BlockStyleDirective;
  @ViewChild('tourWrap') tourWrap: ElementRef;
  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  searchTicketSub: Subscription;
  ticketSearchValue: string;
  arr: string;


  constructor(private ticketService: TicketService,
              private router: Router,
              private ticketStorage: TiсketsStorageService,
              private route: ActivatedRoute,
              private userService: UserService,
              private cdref: ChangeDetectorRef
             ) { }

  
  ngOnInit(): void {
    this.userService.setToken('user-private-token');
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data; 
        this.ticketsCopy = [...this.tickets] 
        this.ticketStorage.setStorage(data); 
      }
    )
    //subscr to ticketSubject
    //1 var
    this.tourUnsubscriber = this.ticketService.ticketType$.subscribe((data: ITourTypeSelect) => {
      console.log('data', data)
    //2 var
    //this.tourUnsubscriber = this.ticketService.getTicketTypeObservable().subscribe((data:ITourTypeSelect) => {  console.log('data', data)  });
    
      let ticketType: string;
      switch (data.value) {
        case "single":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "single");
          break;
        case "multi":
          this.tickets = this.ticketsCopy.filter((el) => el.type === "multi");
          break;
        case "all":
          this.tickets = [...this.ticketsCopy];
          break;

      }
      if (data.date) {
        const dateWithoutTime = new Date(data.date).toISOString().split('T');
        const dateValue = dateWithoutTime[0]
        console.log('dateValue',dateValue)
        this.tickets = this.ticketsCopy.filter((el) => el.date === dateValue);
      }

     
      setTimeout(() => {

        this.blockDirective.updateItems();

        this.blockDirective.initStyle(0);  
      });
    });
  }
  ngAfterViewInit(){
    const fromEventOberver = fromEvent(this.ticketSearch.nativeElement, "keyup")
    this.searchTicketSub = fromEventOberver.pipe(
      debounceTime(200)).subscribe((ev: any) => {
        if (this.ticketSearchValue) {
          this.tickets = this.ticketsCopy.filter((el) => {
            
            const nameToLower = typeof (el?.name) === "string" ? el.name.toLowerCase(): '';
            return nameToLower.includes(this.ticketSearchValue.toLowerCase());
          });
        } else {
          this.tickets = [...this.ticketsCopy]
        }
      }
    );
  }
  
  ngOnDestroy() {
    this.tourUnsubscriber.unsubscribe();
    this.searchTicketSub.unsubscribe();
    this.userService.removeToken();
  }


  goToTicketInfoPage(item: ITour){
    this.router.navigate([`/tickets/ticket/${item.id}`])
  }

  directiveRenderComplete(ev: boolean){
    const el: HTMLElement = this.tourWrap.nativeElement;
    el.setAttribute('style', 'background-color: #f5f5dc')
    this.blockDirective.initStyle(0)
    this.renderComplete = true
  }

  findTours(ev: Event):void{
    const searchValue = (<HTMLInputElement>ev.target).value;

    if(searchValue){
      this.tickets = this.ticketsCopy.filter((el) => el.name.includes(searchValue));
    }
    else {
      this.tickets = [...this.ticketsCopy]
    }
  }

}
