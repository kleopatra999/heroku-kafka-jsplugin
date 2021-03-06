'use strict';

let cli = require('heroku-cli-util');
let co = require('co');
let HerokuKafkaClusters = require('./clusters.js').HerokuKafkaClusters;

function* kafkaTopic (context, heroku) {
  var topic = yield new HerokuKafkaClusters(heroku, process.env, context).topic(context.args.CLUSTER, context.args.TOPIC);
  if (topic) {
    cli.styledHeader((topic.attachment_name || 'HEROKU_KAFKA') + ' :: ' + topic.topic);
    console.log();
    cli.styledNameValues(topic.info);
  } else {
    process.exit(1);
  }
}

module.exports = {
  topic: 'kafka',
  command: 'topic',
  description: 'shows information about a topic in Kafka',
  args: [
    {
      name: 'TOPIC',
      optional: false
    },
    {
      name: 'CLUSTER',
      optional: true
    }
  ],
  help: `
    Shows information about a topic in your Kafka cluster

    Examples:

    $ heroku kafka:info page-visits
    $ heroku kafka:info page-visits HEROKU_KAFKA_BROWN_URL
`,
  needsApp: true,
  needsAuth: true,
  run: cli.command(co.wrap(kafkaTopic))
};
