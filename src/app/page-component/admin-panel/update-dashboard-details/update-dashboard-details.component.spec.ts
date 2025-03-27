import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDashboardDetailsComponent } from './update-dashboard-details.component';

describe('UpdateDashboardDetailsComponent', () => {
  let component: UpdateDashboardDetailsComponent;
  let fixture: ComponentFixture<UpdateDashboardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDashboardDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDashboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
