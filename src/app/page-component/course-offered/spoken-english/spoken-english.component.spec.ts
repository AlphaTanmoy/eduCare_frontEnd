import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpokenEnglishComponent } from './spoken-english.component';

describe('SpokenEnglishComponent', () => {
  let component: SpokenEnglishComponent;
  let fixture: ComponentFixture<SpokenEnglishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpokenEnglishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpokenEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
