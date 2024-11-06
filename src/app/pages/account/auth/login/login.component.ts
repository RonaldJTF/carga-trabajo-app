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

  /**
   * Implementación de `OnInit`.
   * Ejecuta método para obtener los datos de inicio de sesion del storage del navegador.
   * Y obtiene el paramatro que se encuentra en la URL llamado  `returnUrl`.
   */
  ngOnInit(): void {
    this.hasLogin();
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  /**
   * Inicializa el formulario de logueo, y se agrega algunas validaciones para los campos del formulario.
   */
  createLoginForm(): void {
    this.formLogin = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      rememberCheck: [false]
    })
  }

  /**
   * Implementación de `OnInit`.
   * Ejecuta método para obtener los datos de inicio de sesion del storage del navegador.
   */
  hasLogin(): void {
    this.getLoginItemsFromLocalStorage();
    this.getLoginItemsFromSessionStorage();
  }

  /**
   * Método se utiliza para obtener los datos de inicio de sesion almacenados el LocalStorage del navegador.
   * Si estan disponibles completa automaticamente el formularion y hace el llamado del metodo `onSubmit` para realizar el envio del formulario.
   */
  getLoginItemsFromLocalStorage(): void {
    this.storageItems = this.storageService.getLocalStorage("login");
    if (this.storageItems) {
      this.formLogin.patchValue(this.storageItems);
      this.onSubmit();
    }
  }

  /**
   * Método se utiliza para obtener los datos de inicio de sesion almacenados el SessionStorage del navegador.
   * Si estan disponibles completa automaticamente el formularion y hace el llamado del metodo `onSubmit` para realizar el envio del formulario.
   */
  getLoginItemsFromSessionStorage(): void {
    this.sesionItems = this.storageService.getSessionStorage("login");
    if (this.sesionItems) {
      this.formLogin.patchValue(this.sesionItems);
      this.onSubmit();
    }
  }

  /**
   * Este método almacena el toke de la sesión el storage del navegador.
   * Se valida, que se haya seleccionado en el formulario, el valor `rememberCheck` para ejecuar el metodo dentro de la validación.
   * Luego, se ejecuta el metodo `clearAndSetStorage()`.
   * @param token valor que se desea almacenar que es el token de autenticación.
   */
  remember(token: string): void {
    if (this.formLogin.value.rememberCheck) {
      this.clearAndSetStorage("LocalStorage", token);
    }
    this.clearAndSetStorage("SessionStorage", token);
  }

  /**
   * Método para eliminar cualquier valor almacenado en storage del navegador y establece un nuevo valor proporcionado como argumento.
   * @param storageType indica el tipo de almacenamiento a utilizar.
   * @param token valor que se desea almacenar.
   */
  clearAndSetStorage(
    storageType: "LocalStorage" | "SessionStorage",
    token: string
  ) {
    const clearStorageMethod = `clear${storageType}`;
    const setStorageMethod = `set${storageType}`;

    this.storageService[clearStorageMethod]();
    this.storageService[setStorageMethod]("token", token);
  }

  /**
   * Método para almacenar datos e información del usuario logueado.
   * Se valida, que se haya seleccionado en el formulario, el valor `rememberCheck` para ejecuar el metodo dentro de la validación.
   * Luego, se ejecuta el metodo `clearAndSetItemInStorage()`.
   * @param mySelf información o datos del usuario que se desean almacenar en el storage del navegador.
   */
  rememberMySelf(mySelf: any): void {
    if (this.formLogin.value.rememberCheck) {
      this.clearAndSetItemInStorage("LocalStorage", 'mySelf', mySelf);
    }
    this.clearAndSetItemInStorage("SessionStorage", 'mySelf', mySelf);
  }

  /**
   * Método para eliminar valor almacenado en storage del navegador segun la `key` recibida como parámetro y establece un nuevo valor proporcionado como argumento.
   * @param storageType indica el tipo de almacenamiento a utilizar.
   * @param key llave que apunta al valor que se desea almacenar.
   * @param value valor que se desea almacenar en el storage del navegador.
   */
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

  /**
   * Este método se ejecuta cuando se envía el formulario de logueo.
   * El método primero verifica si el formulario es válido utilizando la propiedad invalid del formulario.
   * Si el formulario no es válido, se marca como tocado y se detiene la ejecución del método.
   */
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

  /**
   * Redirecciona a la pagina recuperar contraseña.
   */
  recoverPasswor() {
    this.router.navigate(['account/auth/recover']).then();
  }

}
