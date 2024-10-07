import { ActivityExpirationPipe } from './activity-expiration.pipe';
import { Methods } from 'src/app/utils/methods';
import { Out } from './activity-expiration.pipe';

describe('ActivityExpirationPipe', () => {
  let pipe: ActivityExpirationPipe;

  beforeEach(() => {
    pipe = new ActivityExpirationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct activity status', () => {
    let inputDates = ['2023-01-01', '2023-12-31', '2023-06-15'];
    let avance = 50;
    let expectedOutput: Out = { classStyle: 'on-track', value: '50%' };// objeto simulado

    spyOn(Methods, 'getActivityStatus').and.returnValue(expectedOutput);

    let result = pipe.transform(inputDates, avance);


    expect(Methods.getActivityStatus).toHaveBeenCalledWith(
      new Date(inputDates[0]), 
      new Date(inputDates[1]), 
      new Date(inputDates[2]), 
      avance
    );

    expect(result).toEqual(expectedOutput);
  });
});