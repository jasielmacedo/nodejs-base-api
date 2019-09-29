module.exports = [
    {
        roles: 'admin',
        allows: [
            { resources: 'create', permissions: "*" },
            { resources: 'read', permissions: "*" },
            { resources: 'update', permissions: "*" },
            { resources: 'delete', permissions: "*" }
        ]
    },
    {
        roles: 'editor',
        allows: [
            { resources: 'create', permissions: "*" },
            { resources: 'read', permissions: "*" },
            { resources: 'update', permissions: "*" },
            { resources: 'delete', permissions: "*" }
        ]
    },
    {
        roles: 'user',
        allows: [
            { resources: 'read', permissions: ["self:user","element"] },
            { resources: 'update', permissions: "self:user" },
        ]
    }, 
    {
        roles: 'guest',
        allows: [
            { resources: 'read', permissions: ["element"] },
        ]
    }
];