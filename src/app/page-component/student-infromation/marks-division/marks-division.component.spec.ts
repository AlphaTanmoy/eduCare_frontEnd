import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksDivisionComponent } from './marks-division.component';

describe('MarksDivisionComponent', () => {
  let component: MarksDivisionComponent;
  let fixture: ComponentFixture<MarksDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarksDivisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarksDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
