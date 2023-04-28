import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {IMenuType} from "../../../models/menuType";
import {ITourTypeSelect} from "../../../models/tours";
import {TicketService} from "../../../services/tickets/ticket.service";
import {MessageService} from "primeng/api";
import {SettingService} from "../../../services/setting/setting.service";


@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {

  menuTypes: IMenuType[];
  selectedMenuType: IMenuType;
  @Output() updateMenuType: EventEmitter<IMenuType> = new EventEmitter()



  
  tourTypes: ITourTypeSelect[] = [
    {label: 'All', value: 'all'},
    {label: 'Single', value: 'single'},
    {label: 'Multi', value: 'multi'}
  ]


  constructor(private ticketService: TicketService, private messageService: MessageService,
              private settingService: SettingService) { }

  
  ngOnInit(): void {
    this.menuTypes = [
      {type: 'custom', label : 'Custom'},
      {type: 'extended', label : 'Extended'}
    ]
  }

  changeType(ev: {ev: Event, value: IMenuType}): void {
    console.log('ev', ev)
    this.updateMenuType.emit(ev.value);
  }

  
  changeTourType(ev:  {ev: Event, value: ITourTypeSelect}): void {
    this.ticketService.updateTour(ev.value)
  }

  
  selectDate(ev: string) {
    console.log('ev', ev)
    this.ticketService.updateTour({date:ev})
  }

  
  initRestError(): void {
    this.ticketService.getError().subscribe((data) => {

    }, (err)=> {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error server'})
    });
  }

  initSettingsData():void{
    this.settingService.loadUserSettingsSubject({
      saveToken: false,
    })
  }

}
