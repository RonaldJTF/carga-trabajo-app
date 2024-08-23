import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleComponent } from './role.component';

describe('RolComponent', () => {
  let component: RoleComponent;
  let fixture: ComponentFixture<RoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleComponent]
    });
    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
