import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFranchiseHomeComponent } from './apply-franchise-home.component';

describe('ApplyFranchiseHomeComponent', () => {
  let component: ApplyFranchiseHomeComponent;
  let fixture: ComponentFixture<ApplyFranchiseHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyFranchiseHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyFranchiseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
