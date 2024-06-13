import { getDirections } from '../../api/googleRoutesApi';

global.fetch = jest.fn();

describe('getDirections', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const originPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  const destinationPlaceId = 'ChIJj61dQgK6j4AR4GeTYWZsKWw';
  const waypointPlaceIds = [
    'ChIJrTLr-GyuEmsRBfy61i59si0',
    'ChIJLfySpTOuEmsRsc_JfJtljdc',
    'ChIJa147K9HX3IAR-lwiGIQv9i4'
  ];

  it('fetches directions data successfully', async () => {
    const mockResponse = {
      routes: [
        {
          legs: [
            { duration_in_traffic: { text: '20 mins', value: 1200 } }
          ]
        }
      ]
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const data = await getDirections(originPlaceId, destinationPlaceId, waypointPlaceIds);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.any(URL), { method: 'GET' });
    expect(data).toEqual(mockResponse);
  });

  it('throws an error when the response is not ok', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    await expect(getDirections(originPlaceId, destinationPlaceId, waypointPlaceIds))
      .rejects
      .toThrow('HTTP error! status: 500');
  });

  it('throws an error when there is a network error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    await expect(getDirections(originPlaceId, destinationPlaceId, waypointPlaceIds))
      .rejects
      .toThrow('Network error');
  });
});
