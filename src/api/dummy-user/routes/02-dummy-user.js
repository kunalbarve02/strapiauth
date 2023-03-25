'use strict';

/**
 * dummy-user router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::dummy-user.dummy-user');
