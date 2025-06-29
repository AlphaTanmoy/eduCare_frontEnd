import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtlinksManagementComponent } from './ytlinks-management.component';

describe('YtlinksManagementComponent', () => {
  let component: YtlinksManagementComponent;
  let fixture: ComponentFixture<YtlinksManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YtlinksManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YtlinksManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
