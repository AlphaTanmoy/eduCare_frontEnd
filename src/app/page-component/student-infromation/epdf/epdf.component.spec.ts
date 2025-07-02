import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpdfComponent } from './epdf.component';

describe('EpdfComponent', () => {
  let component: EpdfComponent;
  let fixture: ComponentFixture<EpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
