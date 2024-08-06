baseUrl = 'https://seahorse-app-ehbvv.ondigitalocean.app/prices';

describe('SeaHorse endpoint tests', () => {

    it('should return 200 OK', async () => {
        let res = await fetch(baseUrl);
        let responseStatus = await res.status;
        let responseStatusText = await res.statusText;
        
        expect(responseStatus).toEqual(200);
        expect(responseStatusText).toEqual('OK');
    });

    it('should contain a day object', async () => {
        
        let res = await fetch(baseUrl);
        let bodyText = await res.json();
        
        let dayStruct = 
            {
                "_id": expect.any(String),
                // The date regex checks it's a valid date within this year. This checks for anomalies in the date.
                "date": expect.stringMatching(/^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(202[0-4])$/),
                "__v": 0,
                "hourlyData": expect.arrayContaining(Array(2).fill(expect.any(Object)))
            };

        expect(bodyText[0]).toMatchObject(dayStruct);
    });

    it('should contain a hour object', async () => {
        let res = await fetch(baseUrl);
        let bodyText = await res.json();
        
        let hourlyDataStruct = 
            {
                "data": {
                    "eur": expect.any(Number),
                    "bgn": expect.any(Number),
                    "volume": expect.any(Number)
                },
                "time": expect.stringMatching(/^(0[0-9]|1[0-9]|2[0-4]):00:00$/),
                "_id": expect.any(String)
            };

        expect(bodyText[0].hourlyData[0]).toMatchObject(hourlyDataStruct);
    });
});