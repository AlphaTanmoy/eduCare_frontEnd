import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtlinksAddComponent } from './ytlinks-add.component';

describe('YtlinksAddComponent', () => {
  let component: YtlinksAddComponent;
  let fixture: ComponentFixture<YtlinksAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YtlinksAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YtlinksAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
