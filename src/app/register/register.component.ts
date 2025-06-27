import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';

  constructor(
    private authService: AuthService,
  ) {}

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
    return phoneRegex.test(phone);
  }

  validateFullName(name: string): boolean {
    const nameRegex = /^[А-Яа-яЁёA-Za-z\s]+$/;
    return nameRegex.test(name);
  }

  onSubmit() {
    if (!this.fullName || this.fullName.trim().length === 0) {
      alert('Поле ФИО обязательно и не может содержать только пробелы');
      return;
    }

    if (!this.email || this.email.trim().length === 0) {
      alert('Поле Email обязательно и не может содержать только пробелы');
      return;
    }

    if (!this.phone || this.phone.trim().length === 0) {
      alert('Поле Телефон обязательно и не может содержать только пробелы');
      return;
    }

    if (!this.password || this.password.trim().length === 0) {
      alert('Поле Пароль обязательно и не может содержать только пробелы');
      return;
    }

    if (!this.validateFullName(this.fullName)) {
      alert('ФИО может содержать только буквы и пробелы.');
      return;
    }

    if (!this.validateEmail(this.email)) {
      alert('Введите корректный email.');
      return;
    }

    if (!this.validatePhone(this.phone)) {
      alert('Введите корректный номер телефона.');
      return;
    }

    const data = {
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        password: this.password
      };

      this.authService.register(data).subscribe({
        next: () => {
          this.authService.login(this.email, this.password).subscribe({
            next: () => alert('Успешно зарегистрирован и вошел в систему!'),
            error: err => alert('Ошибка входа после регистрации: ' + err.error?.message)
          });
        },
        error: err => alert('Ошибка регистрации: ' + err.error?.message)
      });
  }
}