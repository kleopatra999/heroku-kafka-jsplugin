'use strict';

let cli = require('heroku-cli-util');
let co = require('co');
let HerokuKafkaClusters = require('./clusters.js').HerokuKafkaClusters;

function* listTopics (context, heroku) {
  var topics = yield new HerokuKafkaClusters(heroku, process.env, context).topics(context.args.CLUSTER);
  if (topics) {
    cli.styledHeader('Kafka Topics on ' + (topics.attachment_name || 'HEROKU_KAFKA'));
    console.log();
    if (topics.topics.length == 0) {
      console.log("No topics found on this Kafka");
      console.log("Use heroku kafka:create to create a topic.");
    } else {
      cli.table(topics.topics,
        {
          columns:
          [
            {key: 'name', label: 'Name'},
            {key: 'messages', label: 'Messages'},
            {key: 'bytes', label: 'Traffic'}
          ]
        }
      );
    }
  } else {
    process.exit(1);
  }
}

module.exports = {
  topic: 'kafka',
  command: 'list',
  description: 'lists available Kafka topics',
  help: `
    Lists available Kafka topics.

    Examples:

    $ heroku kafka:list
    $ heroku kafka:list HEROKU_KAFKA_BROWN_URL
`,

  args: [
    {
      name: 'CLUSTER',
      optional: true
    }
  ],
  needsApp: true,
  needsAuth: true,
  run: cli.command(co.wrap(listTopics))
};
