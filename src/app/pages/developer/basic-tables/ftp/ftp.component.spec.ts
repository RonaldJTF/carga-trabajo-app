import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpComponent } from './ftp.component';

describe('FtpComponent', () => {
  let component: FtpComponent;
  let fixture: ComponentFixture<FtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FtpComponent]
    });
    fixture = TestBed.createComponent(FtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
