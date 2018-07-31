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
      'longitude': 536219,
      'latitude': 5743354,
    }, {
      'name': 'Evènement 2',
      'description': 'Evènement 2',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 532262,
      'latitude': 5740786,
    }, {
      'name': 'Evènement 3',
      'description': 'Evènement 3',
      'participantsAmount': 35,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 534356,
      'latitude': 5740897,
    }, {
      'name': 'Evènement 4',
      'description': 'Evènement 4',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 530892,
      'latitude': 5749564,
    }, {
      'name': 'Evènement 5',
      'description': 'Evènement 5',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 536187,
      'latitude': 5745493,
    }, {
      'name': 'Evènement 6',
      'description': 'Evènement 6',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 535684,
      'latitude': 5740543,
    }, {
      'name': 'Evènement 7',
      'description': 'Evènement 7',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 537892,
      'latitude': 5748927,
    }, {
      'name': 'Evènement 8',
      'description': 'Evènement 8',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 539298,
      'latitude': 5745938,
    }, {
      'name': 'Evènement 9',
      'description': 'Evènement 9',
      'participantsAmount': 54,
      'datetime': 'Un jour',
      'planner': 'José',
      'referent': 'Gabin',
      'email': 'mail@domaine.com',
      'phone': '061234567',
      'url': 'https://example.com/',
      'dateStart': '2018-09-19T09:57:09.911Z',
      'dateEnd': '2018-09-25T09:57:09.911Z',
      'longitude': 538390,
      'latitude': 5748935,
    }];

    return entityUtils.createInOrder(Event, event);
  },
};
