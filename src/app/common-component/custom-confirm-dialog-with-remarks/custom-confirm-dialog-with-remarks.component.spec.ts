import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmDialogWithRemarksComponent } from './custom-confirm-dialog-with-remarks.component';

describe('CustomConfirmDialogWithRemarksComponent', () => {
  let component: CustomConfirmDialogWithRemarksComponent;
  let fixture: ComponentFixture<CustomConfirmDialogWithRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomConfirmDialogWithRemarksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomConfirmDialogWithRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
