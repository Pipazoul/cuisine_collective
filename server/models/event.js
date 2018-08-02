'use strict';

module.exports = function(Event) {
  /**
   * Set all event's contributors
   *
   * @param {number} eventId
   * @param {number[]} contributorsLocation
   * @param {number[]} contributorsFood
   * @param {number[]} contributorsSkills
   * @param {number[]} contributorsPeople
   * @param {number[]} contributorsAssistants
   */
  Event.setContributors = async function(eventId, contributorsLocation, contributorsFood, contributorsSkills, contributorsPeople, contributorsAssistants) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error(`Event ${eventId} does not exists`);
    }
    await replaceContributors(eventId, Event.app.models.eventContributorLocation, contributorsLocation);
    await replaceContributors(eventId, Event.app.models.eventContributorFood, contributorsFood);
    await replaceContributors(eventId, Event.app.models.eventContributorSkills, contributorsSkills);
    await replaceContributors(eventId, Event.app.models.eventContributorPeople, contributorsPeople);
    await replaceContributors(eventId, Event.app.models.eventContributorAssistants, contributorsAssistants);
  };

  /**
   * Remove all links between event and som contributors (according to the given contributorModel relationship),
   * then link others contributors based on their ids
   *
   * @param {number} eventId
   * @param {any} contributorModel
   * @param {number[]} newIds
   */
  async function replaceContributors(eventId, contributorModel, newIds) {
    await contributorModel.destroyAll({eventId: eventId});
    await contributorModel.create(newIds.map((contributorId) => {
      return {eventId: eventId, contributorId: contributorId};
    }));
  };

  Event.remoteMethod('setContributors', {
    description: '[Custom] Set all event\'s contributors',
    accepts: [
      {arg: 'id', type: 'number'},
      {arg: 'contributorsLocation', type: 'array'},
      {arg: 'contributorsFood', type: 'array'},
      {arg: 'contributorsSkills', type: 'array'},
      {arg: 'contributorsPeople', type: 'array'},
      {arg: 'contributorsAssistants', type: 'array'},
    ],
    http: {path: '/:id/contributors', verb: 'put'},
  });
};
