baseUrl = 'https://seahorse-app-ehbvv.ondigitalocean.app/prices';

describe('SeaHorse endpoint tests', () => {
    
    //Define the expected structure of the JSON response objects
    let hourlyDataStruct = {
            "data": {
                "eur": expect.any(Number),
                "bgn": expect.any(Number),
                "volume": expect.any(Number)
            },
            "time": expect.stringMatching(/^(0[0-9]|1[0-9]|2[0-4]):00:00$/),
            "_id": expect.any(String)
        };

    let dayStruct = {
            "_id": expect.any(String),
            // The date regex checks it's a valid date within this year. This checks for anomalies in the date.
            "date": expect.stringMatching(/^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(202[0-4])$/),
            // simply check if it contains an array. Check for number of elements is done later.
            "hourlyData": expect.arrayContaining(Array(0))
        };


    it('should return 200 OK', async () => {
        let res = await fetch(baseUrl);
        let responseStatus = await res.status;
        let responseStatusText = await res.statusText;
        
        expect(responseStatus).toEqual(200);
        expect(responseStatusText).toEqual('OK');
    });

    it('should contain a day object', async () => {
        
        let res = await fetch(baseUrl);
        let responseJSON = await res.json();

        expect(responseJSON).toHaveLength(224);
        
        expect(responseJSON[0]).toMatchObject(dayStruct);
    });

    it('should contain a hour object', async () => {
        let res = await fetch(baseUrl);
        let responseJSON = await res.json();
        
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

        expect(responseJSON[0].hourlyData[0]).toMatchObject(hourlyDataStruct);
    });

    it('should check each day object', async () => {
        let res = await fetch(baseUrl);
        let responseJSON = await res.json();
        
        let dayStruct = 
            {
                "_id": expect.any(String),
                // The date regex checks it's a valid date within this year. This checks for anomalies in the date.
                "date": expect.stringMatching(/^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(202[0-4])$/),
                "hourlyData": expect.arrayContaining(Array(0))
            };
        responseJSON.forEach(day =>{
            expect(day).toMatchObject(dayStruct);
        });        
    });

    it('should check each hour in each day object', async () => {
        let res = await fetch(baseUrl);
        let responseJSON = await res.json();
        
        // iterate through each day and validate the structure of the object
        responseJSON.forEach(day =>{
            expect(day).toMatchObject(dayStruct);
            expect(day.hourlyData).toHaveLength(24);
            // iterate through each hour of the date and validate the structure of the object
            let hour = day.hourlyData;
            hour.forEach(hour => {
                expect(hour).toMatchObject(hourlyDataStruct);
            })
        });        
    }, timeout = 2000);

});