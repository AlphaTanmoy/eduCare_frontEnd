import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpdfViewComponent } from './epdf-view.component';

describe('EpdfViewComponent', () => {
  let component: EpdfViewComponent;
  let fixture: ComponentFixture<EpdfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpdfViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
