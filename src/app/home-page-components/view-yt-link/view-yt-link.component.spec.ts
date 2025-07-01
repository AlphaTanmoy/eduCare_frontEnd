import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewYtLinkComponent } from './view-yt-link.component';

describe('ViewYtLinkComponent', () => {
  let component: ViewYtLinkComponent;
  let fixture: ComponentFixture<ViewYtLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewYtLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewYtLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
