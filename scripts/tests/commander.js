#!/usr/bin/env node
var program = require('commander');

 program
   .version('0.0.1')
   .option('-C, --chdir <path>', 'change the working directory')
   .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
   .option('-T, --no-tests', 'ignore test hook')
   .option('-p, --peppers', 'Add peppers')
   .option('-P, --pineapple', 'Add pineapple')
   .option('-b, --bbq-sauce', 'Add bbq sauce')
   .option('--p, --fuck-you', 'fuckyou')
   .option('build --env <fuckyou>', 'fuckyou2')
   .parse(process.argv);

if (program.peppers) console.log('  - peppers');
if (program.pineapple) console.log('  - pineapple');
if (program.bbqSauce) console.log('  - bbq');
if (program.fuckYou) console.log('fuckyou');
if (program.env && program.args.length != 0) {
    console.log(program.args);
}

 program
   .command('init')
   .description('run remote setup commands')
   .action(function() {
        console.log('setup');
          });

 program
   .command('exec <cmd>')
   .description('run the given remote command')
   .action(function(cmd) {
        console.log('exec "%s"', cmd);
          });

program
    .command('teardown <dir> [otherDirs...]')
    .description('run teardown commands')
    .action(function(dir, otherDirs) {
        console.log('dir "%s"', dir);
        if (otherDirs) {
            otherDirs.forEach(function (oDir) {
                console.log('dir "%s"', oDir);
            });
        }
    });
