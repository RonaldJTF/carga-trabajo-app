import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Dependency, Hierarchy, Normativity, OperationalManagement, OrganizationChart} from "@models";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {
  private pathOrganizationChart: string = 'organization-chart';
  private pathDependency: string = this.pathOrganizationChart.concat('/dependency');
  private pathHierarchy: string = this.pathOrganizationChart.concat('/hierarchy');
  private pathOperationalManagement: string = this.pathOrganizationChart.concat('/operational-management');
  
  private organizationChartFormGroup: FormGroup;
  
  private _mustRechargeOrganizationChartFormGroup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  private _organizationChart: BehaviorSubject<OrganizationChart> = new BehaviorSubject<OrganizationChart>(null); 

  public mustRechargeOrganizationChartFormGroup$ = this._mustRechargeOrganizationChartFormGroup.asObservable();
  public organizationChart$ = this._organizationChart.asObservable();

  constructor(
    private webRequestService: WebRequestService,
    private formBuilder : FormBuilder,
  ) { }

  getOrganizationChart(id: number): Observable<OrganizationChart> {
    return this.webRequestService.getWithHeaders(`${this.pathOrganizationChart}/${id}`);
  }
  getOrganizationalCharts(): Observable<OrganizationChart[]> {
    return this.webRequestService.getWithHeaders(this.pathOrganizationChart);
  }
  createOrganizationChart(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathOrganizationChart, payload);
  }
  updateOrganizationChart(id: number, payload: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathOrganizationChart}/${id}`, payload);
  }
  deleteSelectedOrganizationalCharts(payload: number[]): Observable<OrganizationChart[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOrganizationChart}`, undefined, payload);
  }
  deleteOrganizationChart(id: number): Observable<HttpResponse<any>> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOrganizationChart}/${id}`)
  }

  //Servicios JERARQUÍA
  getHierarchy(id: number): Observable<Hierarchy> {
    return this.webRequestService.getWithHeaders(`${this.pathHierarchy}/${id}`);
  }
  getHierarchiesByOrganizationChartId(organizationChartId: number): Observable<Hierarchy[]> {
    return this.webRequestService.getWithHeaders(`${this.pathHierarchy}`, {idOrganigrama: organizationChartId});
  }
  createHierarchy(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathHierarchy, payload);
  }
  updateHierarchy(id: number, payload: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathHierarchy}/${id}`, payload);
  }
  deleteHierarchy(id: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathHierarchy}/${id}`);
  }
  deleteHierarchyAndDependency(hierarchyId: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathHierarchy}/with-dependency/${hierarchyId}`);
  }

  //Servicios DEPENDENCIAS
  getDependencyById(id: number): Observable<Dependency> {
    return this.webRequestService.getWithHeaders(`${this.pathDependency}/${id}`);
  }
  getDependencies(): Observable<Dependency[]> {
    return this.webRequestService.getWithHeaders(this.pathDependency);
  }
  createDependency(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathDependency, payload);
  }
  updateDependency(id: number, payload: any): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathDependency}/${id}`, payload);
  }
  deleteDependency(id: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathDependency}/${id}`);
  }


  createHierarchyRelationshipWithOperationalsManagements(organizationalChartIds: number[], hierarchyId: number): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathOperationalManagement, organizationalChartIds, {hierarchyId: hierarchyId});
  }
  getAssignedOperationalsManagements(hierarchyId: number): Observable<OperationalManagement[]> {
    return this.webRequestService.getWithHeaders(`${this.pathOperationalManagement}/assigned`, {hierarchyId: hierarchyId});
  }
  getNoAssignedOperationalsManagements(organizationalChartId: number): Observable<OperationalManagement[]> {
    return this.webRequestService.getWithHeaders(`${this.pathOperationalManagement}/no-assigned`, {organizationalChartId: organizationalChartId});
  }
  deleteHierarchyRelationshipWithOperationalsManagements(relationshipIds: number[]){
    return this.webRequestService.deleteWithHeaders(`${this.pathOperationalManagement}`, null, relationshipIds);
  }

  /**
   * Elimina la relación entre la jerarquía y la gestión operativa.
   * @param relationshipId Id de la relación entre la jerarquía y la gestión operativa, es decir, idJerarquiaGestionOperativa
   * @returns 
   */
  deleteHierarchyRelationshipWithOperationalManagement(relationshipId: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOperationalManagement}/${relationshipId}`);
  }

  downloadReport(type: string, organizationChartId: number): Observable<number>{
    const options = {
      responseType: 'blob',
      observe: 'events',
      reportProgress: true
    };
    return this.webRequestService.getWithHeaders(`${this.pathOrganizationChart}/report`, {type: type, organizationChartId: organizationChartId}, null, options).pipe(
      map(e => {
        switch (e.type) {
          case HttpEventType.DownloadProgress:
            return Math.round((100 * e.loaded) / (e.total || 1));
          case HttpEventType.Response:
            this.handleFileDownload(e);
            return 100;
          default:
            return 0;
        }
      })
    )
  }

  private handleFileDownload(response: HttpResponse<Blob>) {
    const filename = this.getFilenameFromHttpResponse(response);
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getFilenameFromHttpResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
    return matches != null ? matches[1] : 'archivo_descargado';
  }

  /*********************************************************************************************************************/
  /******************************************* SECTION OF FORMS TO APPOINTMENT *****************************************/
  /*********************************************************************************************************************/

  setMustRechargeOrganizationChartFormGroup(mustRechargeOrganizationChartFormGroup: boolean){
    this._mustRechargeOrganizationChartFormGroup.next(mustRechargeOrganizationChartFormGroup);
  }

  getOrganizationChartFormGroup(){
    return this.organizationChartFormGroup;
  }

  createOrganizationChartFormGroup(){
    this.resetFormInformation();
    this.organizationChartFormGroup = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: '',
      idNormatividad: '',
      normatividad: null,
    })
    return this.organizationChartFormGroup;
  }

  initializeOrganizationChartFormGroup(organizationChart: OrganizationChart): FormGroup {
    this._organizationChart.next(organizationChart);
    this.organizationChartFormGroup.get('nombre').setValue(organizationChart.nombre);
    this.organizationChartFormGroup.get('descripcion').setValue(organizationChart.descripcion);
    this.organizationChartFormGroup.get('idNormatividad').setValue(organizationChart.idNormatividad);
    this.organizationChartFormGroup.get('normatividad').setValue(organizationChart.normatividad);
    
    return this.organizationChartFormGroup;
  }

  resetFormInformation(){
    this._mustRechargeOrganizationChartFormGroup.next(true);
    this._organizationChart.next(null);
    this.organizationChartFormGroup = null;
  }

  setNormativityToOrganizationChart(normativity: Normativity){
    const formGroup = this.organizationChartFormGroup;
    formGroup?.get('idNormatividad').markAsTouched();
    formGroup?.get('idNormatividad').setValue(normativity?.id);
    formGroup?.get('normatividad').setValue(normativity);
  }

  updateNormativityInOrganizationChart(normativity: Normativity){
    const formGroup = this.organizationChartFormGroup;
    if(formGroup?.get('idNormatividad').value == normativity.id){
      formGroup.get('normatividad').setValue(normativity);
    }
  }

  removeNormativityInOrganizationChart(normativityId: number){
    const formGroup = this.organizationChartFormGroup;
    if(formGroup?.get('idNormatividad').value == normativityId){
      this.setNormativityToOrganizationChart(null);
    }
  }
}
