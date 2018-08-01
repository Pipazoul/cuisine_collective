'use strict';

const entityUtils = require('../util/EntityUtils');

module.exports = {
  generate: function(app) {
    const Contributor = app.models.Contributor;

    const contributor = [{
      'title': 'Les petits frères des pauvres',
      'description': `Les bénévoles des petits frères de pauvres peuvent vous accompagner dans les ateliers cuisine ou les repas collectifs près de chez vous.
        De porte à porte, dans les transports en commun, ou durant tout l\'atelier, nous conviendrons ensemble du format qui vous convient le mieux.`,
      'name': 'Marie DUPONT',
      'hours': `Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n
        Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé`,
      'email': 'mdupont@grandyon.com',
      'phone': '0426647924',
      'address': '8 rue de la forêt',
      'zipcode': '69007',
      'city': 'Lyon',
      'longitude': 538999,
      'latitude': 5749999,
    }, {
      'title': 'Contributeur 2',
      'description': 'Contributeur 2',
      'name': 'Jean DUJARDIN',
      'hours': `Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n
        Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé`,
      'email': 'jdujardin@grandyon.com',
      'phone': '0426647924',
      'address': '8 rue de la Bauge',
      'zipcode': '69004',
      'city': 'Lyon',
      'longitude': 538783,
      'latitude': 5742838,
    }, {
      'title': 'Contributeur 3',
      'description': 'Contributeur 3',
      'name': 'José BOVE',
      'hours': `Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n
        Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé`,
      'email': 'jbove@grandyon.com',
      'phone': '0426647924',
      'address': '8 rue de la plèbe',
      'zipcode': '69001',
      'city': 'Lyon',
      'longitude': 538786,
      'latitude': 5742094,
    }];

    return entityUtils.createInOrder(Contributor, contributor);
  },
};
