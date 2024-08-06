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

    it.skip('should contain a hour object', async () => {
        let res = await fetch(baseUrl);
        let bodyText = await res.json();
        
        let dayStruct = 
            {
                "_id": "65940defe69662b148a643c0",
                "date": "28.12.2023",
                "__v": 0
            };

        expect(bodyText[0]).toMatchObject(dayStruct);
    });
});