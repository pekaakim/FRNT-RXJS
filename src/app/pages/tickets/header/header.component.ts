import { Component, OnInit, OnDestroy, SimpleChanges, Input} from '@angular/core';
import {MenuItem} from "primeng/api";
import {IUser} from "../../../models/users";
import {UserService} from "../../../services/user/user.service";
import {IMenuType} from "../../../models/menuType";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  @Input() menuType: IMenuType;
  private  settingsActive = false;
  items: MenuItem[];
 
  time: Date;
  private timerInterval: number;
  public user: IUser | null;




  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.items = this.initMenuItems()
    
    this.user = this.userService.getUser()

    this.timerInterval = window.setInterval(() =>
    {
      console.log('run')
     this.time = new Date();
    }, 1000)

  }
 
  ngOnDestroy(): void{
    if (this.timerInterval){
      window.clearInterval(this.timerInterval)
    }

  }

  ngOnChanges(ev: SimpleChanges): void {
    this.settingsActive = this.menuType?.type === "extended";
    this.items = this.initMenuItems();
  }

  initMenuItems(): MenuItem[] {
    return [
      {
        label: 'Tickets',
        routerLink:['tickets-list']
      },
      {
        label: 'Settings',
        routerLink:['setting'],
        visible: this.settingsActive
      },
      {
        label: 'Out',
        routerLink:['/auth'],
        command: () => {
          this.userService.removeUser()
        }
      },

    ];
  }



}
