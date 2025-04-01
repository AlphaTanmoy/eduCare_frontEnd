import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseRegistrationComponent } from './franchise-registration.component';

describe('FranchiseRegistrationComponent', () => {
  let component: FranchiseRegistrationComponent;
  let fixture: ComponentFixture<FranchiseRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchiseRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FranchiseRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
