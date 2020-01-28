import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /** Flags for home buttons. **/
  newFlag = true;
  viewAllFlag = false;
  logsFlag = false;
  settingsFlag = false;
  uploadInventoryFlag = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  newButton() {
    this.newFlag = true;
    this.viewAllFlag = false;
    this.logsFlag = false;
    this.settingsFlag = false;
    this.uploadInventoryFlag = false;
  }
  
  viewAllButton() {
    this.newFlag = false;
    this.viewAllFlag = true;
    this.logsFlag = false;
    this.settingsFlag = false;
    this.uploadInventoryFlag = false;
  }

  logsButton() {
    this.newFlag = false;
    this.viewAllFlag = false;
    this.logsFlag = true;
    this.settingsFlag = false;
    this.uploadInventoryFlag = false;
  }

  settingsButton() {
    this.newFlag = false;
    this.viewAllFlag = false;
    this.logsFlag = false;
    this.settingsFlag = true;
    this.uploadInventoryFlag = false;
  }

  uploadInventoryButton() {
    this.newFlag = false;
    this.viewAllFlag = false;
    this.logsFlag = false;
    this.settingsFlag = false;
    this.uploadInventoryFlag = true;
  }

  signOut() {
    if (this.auth.logout()) {
      this.router.navigateByUrl('/login');
    }
  }
}
