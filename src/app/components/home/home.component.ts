import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { HttpServiceProvider } from '../../services/http-service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  private contacts: any = [];
  private contact: any = {};
  private user: number;

  constructor(private router: Router, private httpService: HttpServiceProvider) {
    this.user = parseInt(localStorage.getItem('id'));
  }

  ngOnInit() {
    this.getUserContact()
  }

  private getUserContact() {
    this.httpService.listAllContactsByUser(this.user).subscribe((res) => {
      if(res.status == 200) {
        console.log(res.json());
        this.contacts = res.json();
      }
    }, err => {
      console.log(err);
    })
  }

  private saveNewContact(contact) {
    contact.created_at = new Date();
    this.httpService.saveNewContact(this.user, contact).subscribe((res) => {
      if(res.status == 200) {
        this.contacts.push(res.json());
        this.contact = {}
      }
    }, err => {
      console.log(err);
    })
  }

  private editNewContact(contact) {

  }

  private deleteContact(contact) {
    this.httpService.deleteContactById(this.user, contact.id).subscribe((res) => {
      if(res.status == 200) {
        this.contacts.splice(contact, 1);
      }
    })
  }

  private logoff() {
    this.router.navigate(['login']).then(() => {
      localStorage.clear()
    })
  }

}
