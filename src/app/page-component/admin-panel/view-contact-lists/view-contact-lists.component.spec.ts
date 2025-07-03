import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactListsComponent } from './view-contact-lists.component';

describe('ViewContactListsComponent', () => {
  let component: ViewContactListsComponent;
  let fixture: ComponentFixture<ViewContactListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewContactListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContactListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
