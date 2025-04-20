import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFranchiseComponent } from './manage-franchise.component';

describe('ManageFranchiseComponent', () => {
  let component: ManageFranchiseComponent;
  let fixture: ComponentFixture<ManageFranchiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFranchiseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
