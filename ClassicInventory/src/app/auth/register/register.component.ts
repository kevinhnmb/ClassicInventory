import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  myForm: FormGroup;

  authError:any;

  constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) { 

  }

  ngOnInit() {
    this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    })

     this.myForm = this.fb.group({
      firstName : '',
      lastName : '',
      date_of_birth: '',
      email : '',
      password : '',
      confirmPassword : ''
    })
  }

  createUser(frm) {
    this.auth.register(frm.value);
  }

  login() {
    this.authError = null;
    this.auth.resetError();
    this.router.navigateByUrl('/');
  }

}
