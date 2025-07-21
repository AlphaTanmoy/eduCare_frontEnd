import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEpdfComponent } from './add-epdf.component';

describe('AddEpdfComponent', () => {
  let component: AddEpdfComponent;
  let fixture: ComponentFixture<AddEpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEpdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
