import { IsValueExistsPipe } from './is-value-exists.pipe';

describe('IsValueExistsPipe', () => {
  it('create an instance', () => {
    const pipe = new IsValueExistsPipe();
    expect(pipe).toBeTruthy();
  });
});
