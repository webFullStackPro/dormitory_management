import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {LoginForm} from '../../types/req/LoginForm';
import {SharedModule} from '../shared.module';
import {CaptchaComponent} from '../captcha/captcha.component';
import {LoginSession} from '../../types/resp/loginSession';
import {ADMIN_USERNAME, PASSWORD, TITLE} from '../../const';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    SharedModule,
    CaptchaComponent
  ],
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  verificationCode: string = '';
  title: string = TITLE

  @ViewChild(CaptchaComponent, { static: false }) captchaComponent!: CaptchaComponent;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      verificationCode: ['', [Validators.required]]
    });
    this.initData()
  }

  onVerificationCodeGenerated(verificationCode: string): void {
    this.verificationCode = verificationCode
  }

  initData(): void {
    this.loginForm.get('username')?.patchValue(ADMIN_USERNAME, { emitEvent: false })
    this.loginForm.get('password')?.patchValue(PASSWORD, { emitEvent: false })
  }

  onReset(): void {
    this.captchaComponent.onRefresh()
    this.initData()
    this.loginForm.get('verificationCode')?.patchValue('', { emitEvent: false })
  }

  onSubmit(): void {
    this.loading = true
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (!this.loginForm.valid) {
      this.loading = false
      return
    }
    const formValue = this.loginForm.value;
    if (formValue.verificationCode.toLowerCase() !== this.verificationCode.toLowerCase()) {
      this.message.error('验证码错误');
      this.onReset()
      this.loading = false
      return
    }
    this.authService.login(new LoginForm(formValue)).subscribe({
      next: (resp) => {
        if (!resp || resp.code !== 1) {
          this.message.error('用户名或密码不正确');
          this.onReset()
          return
        }
        const loginSession: LoginSession | undefined = resp.data
        if (loginSession) {
          sessionStorage.setItem('loginToken', loginSession.token)
          sessionStorage.setItem('uid', String(loginSession.uid))
          sessionStorage.setItem('username', loginSession.username)
        }
        this.router.navigate(['/']);
      },
      error: (error) => {
        // 处理错误
        console.error('Login failed:', error);
      },
      complete: () => {
        this.loading = false
      }
    });
  }
}
