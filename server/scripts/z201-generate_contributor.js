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
      'userId': 1,
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
      'userId': 1,
    }];

    return entityUtils.createInOrder(Contributor, contributor);
  },
};
