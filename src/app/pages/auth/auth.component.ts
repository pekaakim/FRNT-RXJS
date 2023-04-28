import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  userName = "Peka_Akim";

  constructor(private authService: AuthService) { }
  isTabCaching: boolean = false;
  someObj: any;
  obj = {a: 1};
  textProp = "Peka"

  ngOnInit(): void {
    this.someObj = this.obj;
  }
  
  changeProp() {
    this.someObj = {a: 1};
    const randIndex = Math.random()
    this.userName = "newValue" + randIndex
    // this.textProp = "someeedf";
  }
 }
