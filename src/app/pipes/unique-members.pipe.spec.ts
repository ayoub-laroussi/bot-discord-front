import { UniqueMembersPipe } from './unique-members.pipe';

describe('UniqueMembersPipe', () => {
  it('create an instance', () => {
    const pipe = new UniqueMembersPipe();
    expect(pipe).toBeTruthy();
  });
});
