'use strict';

const entityUtils = require('../util/EntityUtils');

module.exports = {
  generate: function(app) {
    const Event = app.models.Event;

    const event = [{
      'name': 'Lyon Street Food Festival',
      'description': 'Le festival de la nourriture !',
      'participantsAmount': 23,
      'datetime': 'Du 13 au 16 septembre 2018',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://lyonstreetfoodfestival.com/',
      'dateStart': '2018-09-13T09:57:09.911Z',
      'dateEnd': '2018-09-16T09:57:09.911Z',
      'longitude': 45.7680791,
      'latitude': 4.8177812,
    }];

    return entityUtils.createInOrder(Event, event);
  },
};
