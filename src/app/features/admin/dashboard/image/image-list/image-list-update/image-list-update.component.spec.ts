import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageListCreateComponent } from './image-list-create.component';

describe('ImageListCreateComponent', () => {
  let component: ImageListCreateComponent;
  let fixture: ComponentFixture<ImageListCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageListCreateComponent],
    });
    fixture = TestBed.createComponent(ImageListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
