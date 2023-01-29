
var swig = require('swig');
var template = swig.compileFile(__dirname + '/emails.txt');
const axios = require("axios");

function processParams(program) {

    if (!program.name) {
        console.log('Please provide the full name of the person surrounded by quotation marks.');
        return Promise.reject();
    }
    else if (!program.domain) {
        console.log('Please provide the company\'s domain');
        return Promise.reject();
    }
    else {

        var nameArr = program.name.split(" ");
        if (nameArr.length != 2 || nameArr[0].length == 0 || nameArr[1].length == 0) {
            console.error('You must provide a full name %s', program.name)
            return Promise.reject();
        } else {
            var firstname = nameArr[0].toLowerCase();
            var lastname = nameArr[1].toLowerCase();
            return createEmailsList(program.domain, firstname, lastname);
        }
    }
}

function emailChecker(emailsArr, resolve, reject, i) {
    if (i < emailsArr.length) {
        console.log('Testing %s...', emailsArr[i]);

        const options = {
            method: 'GET',
            url: 'https://email-checker.p.rapidapi.com/verify/v1',
            params: { email: emailsArr[i] },
            headers: {
                'X-RapidAPI-Key': 'e7471fe92amshc18a2b54e65fca0p18e3f3jsne71393ffec35',
                'X-RapidAPI-Host': 'email-checker.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            if (response.data.status === 'valid') {
                console.log("%s is a valid email address", emailsArr[i]);

                resolve(emailsArr[i]);
            } else {
                async () => {
                    await setTimeout(60000);
                    console.log("Waited 60s");
                };
                emailChecker(emailsArr, resolve, reject, i + 1);
            }
        }).catch(function (error) {
            //console.log(error);
            reject();
        });
    } else {
        reject();
    }
}

function createEmailsList(domain, firstname, lastname) {
    var fi = firstname.charAt(0);
    var li = lastname.charAt(0);

    var output = template({
        li: li,
        fi: fi,
        fn: firstname,
        ln: lastname,
        domain: domain
    });

    var emailsArr = output.split('\n');

    return new Promise(function (resolve, reject) {

        emailChecker(emailsArr, resolve, reject, 0);
        // var q = async.queue(function (email, callback) {

        //     console.log('Testing %s...', email);

        //     const options = {
        //         method: 'GET',
        //         url: 'https://email-checker.p.rapidapi.com/verify/v1',
        //         params: { email: 'name@example.com' },
        //         headers: {
        //             'X-RapidAPI-Key': '9d44b7ad8fmsh2c123dd1cf4322dp1cb04ajsn121112117072',
        //             'X-RapidAPI-Host': 'email-checker.p.rapidapi.com'
        //         }
        //     };

        //     axios.request(options).then(function (response) {
        //         console.log(response.data);
        //         if (response.data.status === 'valid') {
        //             console.log("%s is a valid email address", email);

        //             // Kill the queue
        //             q.kill();
        //             return resolve(email);
        //         }
        //         callback();
        //     }).catch(function (error) {
        //         return callback();
        //     });

        // }, 2);

        // emailsArr.forEach(function (email) {
        //     q.push(email, function (err) { });
        // });

        // q.drain = function () {
        //     console.log('Not found: ', JSON.stringify(domain, firstname, lastname));
        //     reject();
        // }
    });
}

module.exports = processParams;
