import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsComponent } from './graphics.component';

describe('Graphics', () => {
  let component: GraphicsComponent;
  let fixture: ComponentFixture<GraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphicsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
