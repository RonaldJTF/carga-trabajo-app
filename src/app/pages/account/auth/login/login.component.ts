import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, CryptojsService, LayoutService, StorageService} from "@services";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin !: FormGroup;
  valCheck: string[] = ['remember'];
  returnUrl!: string;
  storageItems: any;
  sesionItems: any;
  loader = false;

  constructor(
    private authenticationService: AuthenticationService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public layoutService: LayoutService,
    private cryptoService: CryptojsService,
  ) {
    this.createLoginForm();
  }

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
      let {username, password} = this.formLogin.value;
      password = this.cryptoService.encrypt(password);
      const payload = {username, password};
      this.authenticationService.login(payload).subscribe({
        next: (response: any) => {
          this.remember(response.token);
          this.rememberMySelf(response.persona)
          this.loader = false;
          this.router.navigate([""]);
        },
        error: () => {
          this.loader = false;
        },
      });
    }
  }

  recoverPasswor() {
    this.router.navigate(['account/auth/recover']).then();
  }

}
