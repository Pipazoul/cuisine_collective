'use strict';

module.exports = {
  generate: async function(app) {
    // Create admin role
    const adminRole = await app.models.Role.create({'name': 'admin'});

    // Set admin role to user
    const admin = await app.models.User.findOne({where: {email: 'admin@admin.com'}});
    return adminRole.principals.create({principalType: app.models.RoleMapping.USER, principalId: admin.id});
  },
};
