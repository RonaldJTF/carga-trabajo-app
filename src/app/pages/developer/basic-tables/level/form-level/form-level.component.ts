import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BasicTablesService} from "../../../../../services/basic-tables.service";
import {CryptojsService} from "../../../../../services/cryptojs.service";
import {UrlService} from "../../../../../services/url.service";
import {ConfirmationDialogService} from "../../../../../services/confirmation-dialog.service";
import {finalize} from "rxjs";
import {Level} from "../../../../../models/level";

@Component({
  selector: 'app-form-level',
  templateUrl: './form-level.component.html',
  styleUrls: ['./form-level.component.scss']
})
export class FormLevelComponent {

  formLevel: FormGroup;

  updateMode: boolean = false;

  creatingOrUpdating: boolean = false;

  deleting: boolean = false;

  idLevel: number;

  param: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private basicTablesService: BasicTablesService,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private urlService: UrlService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getInitialValue();
  }

  buildForm() {
    this.formLevel = this.formBuilder.group({
      descripcion: ['', Validators.required]
    });
  }

  getInitialValue() {
    this.route.params.subscribe((params) => {
      this.param = params['id'];
    });
    if (this.param != null) {
      this.idLevel = this.cryptoService.decryptParamAsNumber(this.param);
      this.updateMode = true;
      this.getLevel(this.idLevel);
    }
  }

  getLevel(idLevel: number) {
    this.basicTablesService.getLevel(idLevel).subscribe({
      next: (result) => {
        this.assignValuesToForm(result);
      }
    })
  }

  assignValuesToForm(level: Level) {
    this.formLevel.get('descripcion').setValue(level.descripcion);
  }

  private isValido(nombreAtributo: string) {
    return (
      this.formLevel.get(nombreAtributo)?.invalid &&
      (this.formLevel.get(nombreAtributo)?.dirty ||
        this.formLevel.get(nombreAtributo)?.touched)
    );
  }

  get controls() {
    return this.formLevel.controls;
  }

  get nombreNoValido() {
    return this.isValido('descripcion');
  }

  onSubmitLevel(event: Event): void {
    event.preventDefault();
    if (this.formLevel.valid) {
      this.creatingOrUpdating = true;
      this.updateMode ? this.updateLevel(this.idLevel, this.formLevel.value) : this.createLevel(this.formLevel.value);
    } else {
      this.formLevel.markAllAsTouched();
    }
  }

  updateLevel(idLevel: number, level: Level): void {
    let message = '¿Está seguro de actualizar el registro?';
    this.confirmationDialogService.showEventConfirmationDialog(
      message,
      () => {
        this.basicTablesService.updateLevel(idLevel, level).pipe(
          finalize(() => {
            this.creatingOrUpdating = false;
          })
        ).subscribe({
          next: () => {
            this.urlService.goBack();
          }
        })
      },
      () => {
        this.creatingOrUpdating = false;
      }
    )
  }

  createLevel(level: Level): void {
    this.basicTablesService.createLevel(level).pipe(
      finalize(() => {
        this.creatingOrUpdating = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onDeleteLevel(event: Event): void {
    event.preventDefault();
    this.deleting = true;
    this.basicTablesService.deleteLevel(this.idLevel).pipe(
      finalize(() => {
        this.deleting = false;
      })
    ).subscribe({
      next: () => {
        this.urlService.goBack();
      }
    })
  }

  onCancelLevel(event: Event) {
    event.preventDefault();
    this.router.navigate(['developer/basic-tables/level'], {
      skipLocationChange: true,
    }).then();
  }
}
