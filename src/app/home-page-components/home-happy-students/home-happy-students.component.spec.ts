import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHappyStudentsComponent } from './home-happy-students.component';

describe('HomeHappyStudentsComponent', () => {
  let component: HomeHappyStudentsComponent;
  let fixture: ComponentFixture<HomeHappyStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHappyStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHappyStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
