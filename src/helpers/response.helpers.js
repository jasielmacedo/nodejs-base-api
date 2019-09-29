exports.json = function(res,status,obj)
{
    return res.status(status).send(obj);
}