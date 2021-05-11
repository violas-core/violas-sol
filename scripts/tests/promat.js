const prompt = require('prompt');

// start the prompt
prompt.start();

// define properties schema
var schema = {
    properties: {
        name: {
            pattern: /^[a-zA-Z\s\-]+$/,
            message: 'Name must be only letters, spaces, or dashes',
            required: true
        },
        password: {
            hidden: true
        }
    }
};


// ask user for the input
prompt.get(schema, (err, result) => {
    if (err) {
        throw err;
    }

    // print user credentials
    console.log(`${result.name} / ${result.password}`);

});
