import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDetailsComponent } from './master-details.component';

describe('MasterDetailsComponent', () => {
  let component: MasterDetailsComponent;
  let fixture: ComponentFixture<MasterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
