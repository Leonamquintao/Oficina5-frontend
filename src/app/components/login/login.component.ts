import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceProvider } from '../../services/http-service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  private credentials: any = {};
  private formType: boolean = true;
  private validation: boolean = false;
  private errorMessage: string = '';

  constructor(private router: Router, private httpService: HttpServiceProvider) { }

  ngOnInit() { }

  private changeForm(bl) {
    this.formType = bl;
  }

  private login(credentials) {
    if(this.formValidation(credentials, 'login')) {
      this.httpService.getUser(credentials).subscribe((res) => {
        if(res.status == 200) {
          this.storeCredentials(res.json()[0]);
          this.router.navigate(['home']);
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

  private createUser(credentials) {
    if(this.formValidation(credentials, 'signup')) {
      this.httpService.createNewUser(credentials).subscribe((res) => {
        if(res.status == 200) {
          this.storeCredentials(res.json()[0]);
          this.router.navigate(['home']);
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

  private formValidation(fields, form) {
    let formValid: boolean = true;

    if(!this.validateInputEmail(fields.email)) {
      this.errorMessage = 'Email informado inválido!';
      formValid = false;
    }

    if(!this.validateInputPassword(fields.password)) {
      formValid = false;
    }

    if(form == 'signup') {

      if(!this.validateInputName(fields.name)) {
        this.errorMessage = 'O nome informado não está válido!';
        formValid = false;
      }

      if(fields.password !== fields.ps_confirm) {
        this.errorMessage = 'As senhas fornecidas devem ser iguais!';
        formValid = false;
      }
    }

    return formValid
  }

  private storeCredentials(credentials) {
    localStorage.setItem('logged', 'true');
    localStorage.setItem('api_token', credentials.api_token);
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

  private validateInputPassword(pass) {

    let valid: boolean = true

    if(pass == undefined) {
      this.errorMessage = 'A senha não pode ser vazia';
      return false;
    }

    if(this.emptySp(pass)) {

      let pw = pass.trim()

      if(!pw || pw === undefined) {
        this.errorMessage = 'A senha não pode ser vazia';
        valid = false;
      }

      if(this.emptySp(pw) == "") {
        this.errorMessage = 'A senha não pode ser vazia';
        valid = false;
      }

      if(pw.length < 4 || pw.length > 10) {
        this.errorMessage ='A senha deve conter entre 4 a 10 caracteres!';
        valid = false;
      }
    }

    return valid
  }

  private emptySp(str) {
    if(typeof str == 'number') { return }
    if(str === undefined || str === 'undefined') { str = '' }
    return str.replace(/\s/g,'')
  }

}
