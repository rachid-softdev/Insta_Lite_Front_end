import { BaseImageResponseAPI } from './base-image-response-api.model';

describe('BaseImageResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseImageResponseAPI = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
    };
    expect(instance).toBeTruthy();
  });
});
