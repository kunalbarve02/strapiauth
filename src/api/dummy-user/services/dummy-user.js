'use strict';

/**
 * dummy-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dummy-user.dummy-user');
