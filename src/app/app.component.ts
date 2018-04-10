import { Component, enableProdMode } from '@angular/core';
import { Router } from '@angular/router'

enableProdMode()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private router: Router) {
    if (localStorage.getItem('logged') == 'true') {
      router.navigate(['home']);
    } else {
      router.navigate(['login']);
    }
  }
}
