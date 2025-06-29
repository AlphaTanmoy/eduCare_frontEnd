import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishTicketComponent } from './publish-ticket.component';

describe('PublishTicketComponent', () => {
  let component: PublishTicketComponent;
  let fixture: ComponentFixture<PublishTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
