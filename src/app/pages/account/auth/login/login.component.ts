import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formLogin !: FormGroup;
  valCheck: string[] = ['remember'];
  returnUrl!: string;
  storageItems: any;
  sesionItems: any;
  loader = false;

  constructor(
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private formBuilder : FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public layoutService: LayoutService
  ){this.createLoginForm();}

  ngOnInit(): void {
    this.hasLogin();
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }


  createLoginForm(): void {
    this.formLogin = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      rememberCheck: [false]
    })
  }

  hasLogin(): void {
    this.getLoginItemsFromLocalStorage();
    this.getLoginItemsFromSessionStorage();
  }

  getLoginItemsFromLocalStorage(): void {
    this.storageItems = this.storageService.getLocalStorage("login");
    if (this.storageItems) {
      this.formLogin.patchValue(this.storageItems);
      this.onSubmit();
    }
  }

  getLoginItemsFromSessionStorage(): void {
    this.sesionItems = this.storageService.getSessionStorage("login");
    if (this.sesionItems) {
      this.formLogin.patchValue(this.sesionItems);
      this.onSubmit();
    }
  }

  remember(token: string): void {
    if (this.formLogin.value.rememberCheck) {
      this.clearAndSetStorage("LocalStorage", token);
    }
    this.clearAndSetStorage("SessionStorage", token);
  }

  clearAndSetStorage(
    storageType: "LocalStorage" | "SessionStorage",
    token: string
  ) {
    const clearStorageMethod = `clear${storageType}`;
    const setStorageMethod = `set${storageType}`;

    this.storageService[clearStorageMethod]();
    this.storageService[setStorageMethod]("token", token);
  }

  rememberMySelf(mySelf: any): void {
    if (this.formLogin.value.rememberCheck) {
      this.clearAndSetItemInStorage("LocalStorage", 'mySelf', mySelf);
    }
    this.clearAndSetItemInStorage("SessionStorage", 'mySelf', mySelf);
  }

  clearAndSetItemInStorage(
    storageType: "LocalStorage" | "SessionStorage",
    key: string,
    value: any,
  ) {
    const clearStorageMethod = `remove${storageType}Item`;
    const setStorageMethod = `set${storageType}`;

    this.storageService[clearStorageMethod](key);
    this.storageService[setStorageMethod](key, value);
  }

  onSubmit() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    } else {
      this.loader = true;
      const { username, password } = this.formLogin.value;
      const payload = { username, password };
      this.authenticationService.login(payload).subscribe({
        next: (response: any) => {
          this.remember(response.token);
          this.rememberMySelf(response.persona)
          this.loader = false;
          this.router.navigate([""]);
        },
        error: (error) => {
          this.loader = false;
        },
      });
    }
  }
}
