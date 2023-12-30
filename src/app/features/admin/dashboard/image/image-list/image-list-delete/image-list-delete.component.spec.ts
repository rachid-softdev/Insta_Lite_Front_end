import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageListDeleteComponent } from './image-list-delete.component';

describe('ImageListDeleteComponent', () => {
  let component: ImageListDeleteComponent;
  let fixture: ComponentFixture<ImageListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageListDeleteComponent],
    });
    fixture = TestBed.createComponent(ImageListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
