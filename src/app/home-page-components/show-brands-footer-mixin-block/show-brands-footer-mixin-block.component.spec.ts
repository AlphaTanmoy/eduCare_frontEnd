import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBrandsFooterMixinBlockComponent } from './show-brands-footer-mixin-block.component';

describe('ShowBrandsFooterMixinBlockComponent', () => {
  let component: ShowBrandsFooterMixinBlockComponent;
  let fixture: ComponentFixture<ShowBrandsFooterMixinBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBrandsFooterMixinBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBrandsFooterMixinBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
