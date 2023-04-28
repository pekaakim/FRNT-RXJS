import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {IUser} from "../../../models/users";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";


@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})

export class AuthorizationComponent implements OnInit, OnChanges, OnDestroy {
@Input() inputProp = 'active';
@Input() inputObj: any;



  loginText = 'Login';
  pswText: string = 'Password'
  psw: string;
  login: string;
  selectedValue: boolean;
  cardNumber: string;
  authTextButton: string;

  constructor(private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private userService: UserService ) { }

  ngOnInit(): void {
    this.authTextButton = "Authorization"
  }


  vipStatusSelected():void{

  }

  ngOnDestroy(): void {
    console.log('destroy');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes)
    if (changes['inputProp']){
      const preValue = changes['inputProp'].previousValue;
      console.log('prevValue', preValue)
      if (changes['inputProp'].firstChange){
        console.log('first changes')
      }
    }
    console.log(this.inputProp);

  }
  onAuth(ev: Event): void{
    const authUser: IUser ={
      psw: this.psw,
      login: this.login,
      cardNumber: this.cardNumber
    }
    if (this.authService.checkUser(authUser)) {
      this.userService.setUser(authUser);
      this.userService.setToken('user-private-token')
      this.router.navigate(['tickets/tickets-list']);
      }
    else {
      this.messageService.add({severity:'error', summary: 'Incorrect', detail: 'Wrong login or password'});
    }

  }

}
