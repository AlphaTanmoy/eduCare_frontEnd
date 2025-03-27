import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRegistrationComponent } from './about-registration.component';

describe('AboutRegistrationComponent', () => {
  let component: AboutRegistrationComponent;
  let fixture: ComponentFixture<AboutRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
