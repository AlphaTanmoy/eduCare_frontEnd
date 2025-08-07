import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpblockerComponent } from './ipblocker.component';

describe('IpblockerComponent', () => {
  let component: IpblockerComponent;
  let fixture: ComponentFixture<IpblockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpblockerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpblockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
