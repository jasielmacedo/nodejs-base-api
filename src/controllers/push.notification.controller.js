const Debug = require('debug')('push:controller');
const response = require('../helpers/response.helpers');

exports.subscribe = function(req, res)
{
    const {subscription} = req.body;
    
    subscriptionObj = JSON.parse(subscription);

    const payload = JSON.stringify({
        'title': 'Push notification works!',
        'body' : 'Welcome to the list'
    });


    req.webpush.sendNotification(subscriptionObj,payload).catch(error => console.log(error));

    return response.json(res,200,{'success':true});
}