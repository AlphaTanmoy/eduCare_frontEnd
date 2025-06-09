import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayWalletComponent } from './pay-wallet.component';

describe('PayWalletComponent', () => {
  let component: PayWalletComponent;
  let fixture: ComponentFixture<PayWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
