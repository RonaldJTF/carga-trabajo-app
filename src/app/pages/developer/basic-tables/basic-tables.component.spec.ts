import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTablesComponent } from './basic-tables.component';

describe('BasicTablesComponent', () => {
  let component: BasicTablesComponent;
  let fixture: ComponentFixture<BasicTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicTablesComponent]
    });
    fixture = TestBed.createComponent(BasicTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
