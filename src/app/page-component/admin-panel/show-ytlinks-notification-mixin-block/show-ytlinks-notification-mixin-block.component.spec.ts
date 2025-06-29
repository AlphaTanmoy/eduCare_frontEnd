import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowYtlinksNotificationMixinBlockComponent } from './show-ytlinks-notification-mixin-block.component';

describe('ShowYtlinksNotificationMixinBlockComponent', () => {
  let component: ShowYtlinksNotificationMixinBlockComponent;
  let fixture: ComponentFixture<ShowYtlinksNotificationMixinBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowYtlinksNotificationMixinBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowYtlinksNotificationMixinBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
