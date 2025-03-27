import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterVerifyComponent } from './center-verify.component';

describe('CenterVerifyComponent', () => {
  let component: CenterVerifyComponent;
  let fixture: ComponentFixture<CenterVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
