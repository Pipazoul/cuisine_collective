'use strict';

const entityUtils = require('../util/EntityUtils');

module.exports = {
  generate: function(app) {
    const User = app.models.User;

    const user = [{
      'username': 'Admin',
      'password': 'Gestion',
      'email': 'admin@admin.com',
      'emailVerified': true,
    }];

    return entityUtils.createInOrder(User, user);
  },
};
