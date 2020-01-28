import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  myForm: FormGroup;



  constructor(private db: AngularFirestore, private fb: FormBuilder, private router: Router, private auth: AuthService) { }

  ngOnInit() {


    document.getElementById("email").setAttribute("placeholder", this.auth.getAuth().auth.currentUser.email);
    document.getElementById("firstName").setAttribute("placeholder", this.auth.getAuth().auth.currentUser.displayName.split(" ")[0]);
    document.getElementById("lastName").setAttribute("placeholder", this.auth.getAuth().auth.currentUser.displayName.split(" ")[1]);


    this.myForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }

  submit(frm) {
    console.log(frm.value);

    if (frm.value.firstName || frm.value.lastName) {
      console.log("First name or last name.")
    }

    if (frm.value.email) {
      console.log("Email");
    }

    if (frm.value.oldPassword && frm.value.newPassword && frm.value.confirmNewPassword) {
      console.log("All password fields entered.");
    } else if (frm.value.oldPassword || frm.value.newPassword || frm.value.confirmNewPassword) {
      console.log("All password fields must be entered.");
    }

  }

}
