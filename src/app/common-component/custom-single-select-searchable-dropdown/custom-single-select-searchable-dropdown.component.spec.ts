import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSingleSelectSearchableDropdownComponent } from './custom-single-select-searchable-dropdown.component';

describe('CustomSingleSelectSearchableDropdownComponent', () => {
  let component: CustomSingleSelectSearchableDropdownComponent;
  let fixture: ComponentFixture<CustomSingleSelectSearchableDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSingleSelectSearchableDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSingleSelectSearchableDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
