import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsManagementComponent } from './brands-management.component';

describe('BrandsManagementComponent', () => {
  let component: BrandsManagementComponent;
  let fixture: ComponentFixture<BrandsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
