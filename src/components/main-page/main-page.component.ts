import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.authService.login();
  }

  onRegister(): void {
    this.authService.register();
  }
}
