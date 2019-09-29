var response = require('../helpers/response.helpers');
var ElementType = require('../models/element.type.model');
const Debug = require('debug')('element-type:controller');

exports.create = function(req,res)
{
    let {name, type} = req.body;

    if((name == undefined || name == null) || 
       (type == undefined || type == null))
    {
        return response.json(res,200,{
            success : false,
            errorNum : 0,
            error: "Invalid params"
        });
    }

    const el = new ElementType({
        name : name,
        modelType : type,
        status : 1,
    });

    el.save().then((data) => {
        return response.json(res,200,{
            success : true,
            data : {
                id : data._id
            }
        });
    }).catch((err) => {
        Debug(err);
        return response.json(res,200,{
            success: false,
            errorNum : 1,
            error : err.message || 'Error to create new Element'
        });
    });
}

exports.update = function(req,res)
{
    let {name} = req.body;

    if((name == undefined || name == null))
    {
        return response.json(res,200,{
            success : false,
            errorNum : 0,
            error: "Invalid params"
        });
    }

    ElementType.findOneAndUpdate({
        _id: req.params.elementId
    },{
        name: name,
    }, {new: true}).then((data) => {
        if(!data){
            return response.json(res,200,{
                success : false,
                errorNum : 1,
                error: "Error trying to retrieve the updated info"
            });
        }
        return response.json(res,200,{
            success : true,
            data : data
        });
    }).catch((err) => {
        Debug(err);
        if(err.kind === 'ObjectId')
        {
            return response.json(res,200,{
                success:false,
                errorNum : 2,
                error:'Element not found'
            });
        }

        return response.json(res,200,{
            success : false,
            errorNum : 3,
            error : err.message || "Error to find this element"
        });
    });
}

exports.view = function(req,res)
{
    var elementId = req.params.elementId;

    if(!elementId)
        return response.json(res,200,{success : false, errorNum : 0,error : 'Invalid ElementID'});

    ElementType.findOne({
        _id: elementId
    }).then((element) => {
        if(!element)
        {
            return response.json(res,200,{
                success : false,
                errorNum : 1,
                error : 'Element not found'
            });
        }else{
            return response.json(res,200,{
                success : true,
                data : element
            });
        }
    }).catch((err) => {
        Debug(err);
        if(err.kind === 'ObjectId')
        {
            return response.json(res,200,{
                success:false,
                errorNum : 2,
                error:'Element not found'
            });
        }

        return response.json(res,200,{
            success : false,
            errorNum : 3,
            error : err.message || "Error to find this Element"
        });
    });
}

exports.list = function(req,res)
{
    var elementType = req.params.elementType;

    var limit =  req.query.limit || 50;
    var skip = req.query.offset || 0;
    var sort = req.query.sort && req.query.sort.toLowerCase() == 'asc'?1:-1;
    var name = req.query.name || null;

    limit = parseInt(limit);
    if(limit == NaN)
        limit = 50;

    skip = parseInt(skip);
    if(skip == NaN)
        skip = 0;

    if(limit > 200)
        limit = 200;

    var args = [
        {
            $match : {
                status : 1,
                modelType : elementType
            }
        },
        {
            $sort: {
                "createdAt": sort,
            }
        },
        {  $skip : skip },
        {  $limit : limit }
    ];

    if(name != null && name != undefined)
    {
        args[0].$match.name = {
            $regex: name 
        };
    }

    ElementType.aggregate(args).then(itens => {
        if(!itens)
        {
            return response.json(res,200,{'success' : false,'data' : {}, count : 0});
        }else{
            return response.json(res,200,
            {
                success: itens.length>0?true:false,
                data: itens,
                count : itens.length
            });
        }
    }).catch(err => {
        Debug(err);
        return response.json(res,200,
        {
            'success' : false,
            'errorNum' : 1,
            'error' : err
        });
    });
}

exports.delete = function(req,res)
{
    ElementType.findOneAndUpdate({
        _id: req.params.elementId
    },{
        status: 0
    }, {new: true}).then((data) => {
        if(!data){
            return response.json(res,200,{
                success : false,
                errorNum : 0,
                error: "Error trying to retrieve the info"
            });
        }
        return response.json(res,200,{
            success : true
        });
    }).catch((err) => {
        Debug(err);
        if(err.kind === 'ObjectId')
        {
            return response.json(res,200,{
                success:false,
                errorNum : 1,
                error:'Element not found'
            });
        }

        return response.json(res,200,{
            success : false,
            errorNum : 2,
            error : err.message || "Error to find this element"
        });
    });
}