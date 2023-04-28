import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {UserService} from "../../../services/user/user.service";
import {IUser} from "../../../models/users";

@Component({
  selector: 'app-change-password',

  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  currentPsw : string;
  newPsw: string;
  newPswRepeat: string

  constructor(private messageService: MessageService,
              private userService: UserService) { }

  ngOnInit(): void {
  }
  changePsw(): void | boolean{
    const userPsw = this.userService.getUser()?.psw;
    if (userPsw !== this.currentPsw) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Invalid current passwords'});
      return false;
    }
    if (this.newPsw !== this.newPswRepeat) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'New passwords do not match'});
      return false;
    }
    else {
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Password successfully changed'});
      const user = this.userService.getUser();
      const newUser = <IUser> {...user};
      newUser.psw = this.newPsw;
      this.userService.setUser(newUser);
    }


  }
}
