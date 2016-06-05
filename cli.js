#!/usr/bin/env node
'use strict';
var meow = require('meow');
var commitbycommit = require('./');

var cli = meow([
	'Usage',
	'  $ commitbycommit . (next|prev)',
	'',
	'Options',
	'  --branch  the branch on which we iterate through the commmits [Default: master]',
	'',
	'',
	'Examples',
	'  $ commitbycommit',
	'  => goes to the next commit',
	'  $ commitbycommit next',
	'  => goes to the next commit',
	'  $ commitbycommit prev',
	'  => goes to the previous commit'
]);

commitbycommit(cli.input, cli.flags);
