import { MeanAverage } from '@src/util/average';

describe('Average', () => {

  it('should get expected average', () => {
    const avg = new MeanAverage();
    avg.add(1, 2, 3, 4, 5, 6, 7, 8, 9, 20);
    expect(avg.value()).toBe(6.5);
  });

  it('should get expected average2', () => {
    const avg = new MeanAverage();
    avg.add(1, 2, 3, 4, 20, 5, 6, 7, 8, 9);
    expect(avg.value()).toBe(6.5);
  });

});
