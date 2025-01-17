import {Injectable} from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {Observable} from "rxjs";
import {Dependency, Hierarchy, OrganizationChart} from "@models";
import {HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrganizationChartService {
  private pathOrganizationChart: string = 'organization-chart';
  private pathDependency: string = this.pathOrganizationChart.concat('/dependency');
  private pathHierarchy: string = this.pathOrganizationChart.concat('/hierarchy');
  private formData: any = {};

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getOrganizationChartById(id: number): Observable<OrganizationChart> {
    return this.webRequestService.getWithHeaders(`${this.pathOrganizationChart}/${id}`);
  }
  getOrganizationalCharts(): Observable<OrganizationChart[]> {
    return this.webRequestService.getWithHeaders(this.pathOrganizationChart);
  }
  createOrganizationChart(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathOrganizationChart, payload);
  }
  updateOrganizationChart(id: number, payload: any): Observable<HttpResponse<any>> {
    return this.webRequestService.putWithHeaders(`${this.pathOrganizationChart}/${id}`, payload);
  }
  deleteSelectedOrganizationalCharts(payload: number[]): Observable<OrganizationChart[]> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOrganizationChart}`, undefined, payload);
  }
  deleteOrganizationChart(id: number): Observable<HttpResponse<any>> {
    return this.webRequestService.deleteWithHeaders(`${this.pathOrganizationChart}/${id}`)
  }

  //Servicios JERARQUÍA
  getHierarchiesByOrganizationChartId(organizationChartId: number): Observable<Hierarchy[]> {
    return this.webRequestService.getWithHeaders(`${this.pathHierarchy}`, {idOrganigrama: organizationChartId});
  }
  createHierarchy(payload: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathHierarchy, payload);
  }
  deleteHierarchy(id: number): Observable<any> {
    return this.webRequestService.deleteWithHeaders(`${this.pathHierarchy}/${id}`);
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

  setFormData(data: any) {
    this.formData = data;
  }
  getFormData() {
    return this.formData;
  }
}
