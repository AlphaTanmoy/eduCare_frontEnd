import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMultiSelectDropdownComponent } from './custom-multi-select-dropdown.component';

describe('CustomMultiSelectDropdownComponent', () => {
  let component: CustomMultiSelectDropdownComponent;
  let fixture: ComponentFixture<CustomMultiSelectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMultiSelectDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMultiSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
