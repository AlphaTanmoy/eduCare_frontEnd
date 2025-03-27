import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFranchiesComponent } from './apply-franchies.component';

describe('ApplyFranchiesComponent', () => {
  let component: ApplyFranchiesComponent;
  let fixture: ComponentFixture<ApplyFranchiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyFranchiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyFranchiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
