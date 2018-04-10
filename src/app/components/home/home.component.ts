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
  private validation: boolean = false;
  private errorMessage: string;
  private isEdit: boolean = false;

  constructor(private router: Router, private httpService: HttpServiceProvider) {
    this.user = parseInt(localStorage.getItem('id'));
    this.contact.birth = new Date().toISOString().substring(0, 10);
  }

  ngOnInit() {
    this.getUserContact()
  }

  private getUserContact() {
    this.httpService.listAllContactsByUser(this.user).subscribe((res) => {
      if(res.status == 200) {
        this.contacts = res.json();
      }
    }, err => {
      console.log(err);
    })
  }

  private saveNewContact(contact) {
    if(this.formValidation(contact)) {
      contact.created_at = new Date();
      this.httpService.saveNewContact(this.user, contact).subscribe((res) => {
        if(res.status == 200) {
          this.contacts.push(res.json());
          this.validation = false;
          this.cancelEdit();
        }
      }, err => {
        if(err) {
          this.validation = true;
          this.errorMessage = err.text();
        }
      })
    } else {
      this.validation = true;
    }
  }

  private sendToEdit(cn, idx) {

    this.contact.id = cn.id;
    this.contact.name = cn.name;
    this.contact.email = cn.email;
    this.contact.phone = cn.phone;
    this.contact.birth = new Date(cn.birth).toISOString().substring(0, 10);
    this.contact.updated_at = new Date();

    this.isEdit = true;

  }

  private cancelEdit() {
    this.contact = {}
    this.contact.birth = new Date().toISOString().substring(0, 10);
    this.isEdit = false;
  }

  private editContact(cn, idx) {

    if(this.formValidation(cn)) {

      this.httpService.updateContact(this.user, cn).subscribe((res) => {
        if(res.status == 200) {
          this.contacts.splice(idx, 1);
          this.contacts.push(res.json())
          this.validation = false;
          this.cancelEdit();
        }
      }, err => {
        if(err) {
          this.validation = true;
          this.errorMessage = err.text();
        }
      })

    } else {
      this.validation = true;
    }
  }

  private deleteContact(contact, idx) {
    this.httpService.deleteContactById(this.user, contact.id).subscribe((res) => {
      if(res.status == 200) {
        this.contacts.splice(idx, 1);
      }
    })
  }

  private logoff() {
    this.router.navigate(['login']).then(() => {
      localStorage.clear()
    })
  }

  private formValidation(fields) {
    let formValid: boolean = true;

    if(!this.validateInputEmail(fields.email)) {
      this.errorMessage = 'Email informado inválido!';
      formValid = false;
    }

    if(!this.validateInputPhone(fields.phone)) {
      this.errorMessage = 'Telefone informado inválido!';
      formValid = false;
    }

    if(!this.validateInputName(fields.name)) {
      this.errorMessage = 'O nome informado não está válido!';
      formValid = false;
    }

    return formValid
  }

  private validateInputName(txt) {
    if(this.emptySp(txt) == "") { return false }
    let desired = txt.trim()
    if(desired.length < 2 || desired.length > 100) { return false }
    let RegExp = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/

    return RegExp.test(desired)
  }

  private validateInputEmail(email) {
    if(this.emptySp(email) == "") { return false }
    let mail = email.trim()
    let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regexp.test(mail)
  }

  private validateInputPhone(num) {
    if(!num) { return false }

    if(typeof num == 'string') {
      let x = num.replace(/[^0-9]/g, '')
      num = parseInt(x)
    }

    // PT +351 (912) 703-783 -> 9
    // usa +1 (973) 980-1822 -> 10
    // BR +55 (021) 98144-0334 -> 12
    // BR FIX (021) 2525-1234 -> 11

    if(num.length < 9 || num.length > 12) { return false }
    let RegExp = /^([0-9]{3})([0-9]{6,9})$/

    return RegExp.test(num)
  }

  private maskPhone(ev) {
    let num = ev.target.value.replace(/\D/g,'')
    num = num.substring(0,12)

    if(num.length == 0) {
      num = num
    } else if(num.length < 4){
      num = '('+num
    } else if(num.length < 10) {
      num = '('+num.substring(0,3)+') '+num.substring(3,6)+'-'+num.substring(6,9)
    } else if(num.length == 10) {
      num = '('+num.substring(0,3)+') '+num.substring(3,6)+'-'+num.substring(6,10)
    } else if(num.length == 11) {
      num = '('+num.substring(0,3)+') '+num.substring(3,7)+'-'+num.substring(7,11)
    } else {
      num = '('+num.substring(0,3)+') '+num.substring(3,8)+'-'+num.substring(8,12)
    }

    this.contact.phone = num;
  }

  private emptySp(str) {
    if(typeof str == 'number') { return }
    if(str === undefined || str === 'undefined') { str = '' }
    return str.replace(/\s/g,'')
  }

}
