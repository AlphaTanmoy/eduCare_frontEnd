import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterLoginComponent } from './center-login.component';

describe('CenterLoginComponent', () => {
  let component: CenterLoginComponent;
  let fixture: ComponentFixture<CenterLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
