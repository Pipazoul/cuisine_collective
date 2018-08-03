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
      'hours': 'Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n' +
        'Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé',
      'email': 'mdupont@grandyon.com',
      'phone': '0426647924',
      'houseNumber': '8',
      'street': 'rue de la forêt',
      'zipcode': '69007',
      'city': 'Lyon',
      'longitude': 538999,
      'latitude': 5749999,
      'location': true,
      'food': true,
      'skills': false,
      'people': false,
      'assistants': true,
    }, {
      'title': 'Office of Strategic Services',
      'description': 'Distribution gratuite de biscottes et de beurre',
      'name': 'Jean DUJARDIN',
      'hours': 'Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n' +
        'Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé',
      'email': 'jdujardin@grandyon.com',
      'phone': '0426647924',
      'houseNumber': '8',
      'street': 'rue de la Bauge',
      'zipcode': '69004',
      'city': 'Lyon',
      'longitude': 538783,
      'latitude': 5742838,
      'location': false,
      'food': false,
      'skills': false,
      'people': false,
      'assistants': true,
    }, {
      'title': 'Confédération paysanne',
      'description': 'Distribution gratuite de maïs sans OGM',
      'name': 'José BOVE',
      'hours': 'Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n' +
        'Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé',
      'email': 'jbove@grandyon.com',
      'phone': '0426647924',
      'houseNumber': '8',
      'street': 'rue de la plèbe',
      'zipcode': '69001',
      'city': 'Lyon',
      'longitude': 538786,
      'latitude': 5742094,
      'location': false,
      'food': true,
      'skills': true,
      'people': false,
      'assistants': true,
    }, {
      'title': 'Les restos du coeur',
      'description': `Aider et apporter une assistance bénévole aux personnes démunies, notamment dans le domaine alimentaire par l'accès à des repas gratuits,
        et par la participation à leur insertion sociale et économique, ainsi qu'à toute l'action contre la pauvreté sous toutes ses formes`,
      'name': 'Coluche',
      'hours': 'Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n' +
        'Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé',
      'email': 'restos-du-coeur@grandyon.com',
      'phone': '0426647924',
      'houseNumber': '8',
      'street': 'rue de la générosité',
      'zipcode': '69002',
      'city': 'Lyon',
      'longitude': 538784,
      'latitude': 5742420,
      'location': true,
      'food': true,
      'skills': false,
      'people': true,
      'assistants': false,
    }, {
      'title': 'Cauchemard en cuisine',
      'description': 'Offrir à tous la possibilité de s\'améliorer en cuisinant, grâce à l\'intervention d\'un coach expérimenté',
      'name': 'Philippe Etchebest',
      'hours': 'Lundi: 12h00-14h00\r\nMardi : 12h00-14h00\r\nMercredi : 12h00-14h00 / 19h00-21h00\r\n' +
        'Jeudi :12h00-14h00 / 19h00-21 h00\r\nVendredi : 12h00-14h00 / 19h00-21h00\r\nSamedi : Fermé\r\nDimanche : Fermé',
      'email': 'philippe-etchebest@grandyon.com',
      'phone': '0426647924',
      'houseNumber': '8',
      'street': 'rue du cauchemard',
      'zipcode': '69006',
      'city': 'Lyon',
      'longitude': 538802,
      'latitude': 5742530,
      'location': false,
      'food': false,
      'skills': true,
      'people': false,
      'assistants': false,
    }];

    return entityUtils.createInOrder(Contributor, contributor);
  },
};
