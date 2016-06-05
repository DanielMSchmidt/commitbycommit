'use strict';
var NodeGit = require('nodegit');

// Constants
var NEXT = 'next';
var PREV = 'prev';

function logInfo(commit) {
	console.log('Commit: ' + commit.message() + '\n');
	commit.getDiff()
		.then(function (diffList) {
			diffList.forEach(function (diff) {
				diff.patches().then(function (patches) {
					console.log('Files: \n');
					patches.forEach(function (patch) {
						console.log('\t' + patch.oldFile().path() + '\n');
					});
				});
			});
		});
}

function getCommitIndex(commits, currentCommit) {
	for (var i = 0; i < commits.length; i++) {
		if (commits[i].sha() === currentCommit) {
			return i;
		}
	}

	return -1;
}

function handle(commits, repo, currentCommit, direction) {
	var commitIndex = getCommitIndex(commits, currentCommit);
	var commitToCheckOut;

	if (direction === PREV) {
		commitToCheckOut = commits[commitIndex + 1];
	} else {
		commitToCheckOut = commits[commitIndex - 1];
	}

	repo.createBranch('presenting', commitToCheckOut, true, repo.defaultSignature(), '').then(function () {
		repo.checkoutBranch('presenting').then(function () {
			logInfo(commitToCheckOut);
		});
	});
}

module.exports = function (input, flags) {
	var path = require('path').resolve(input[0]);
	var direction = (input[1] === PREV) ? PREV : NEXT;
	var branch = flags.branch || 'master';

	NodeGit.Repository.open(path)
	.then(function (repo) {
		repo.getHeadCommit().then(function (current) {
			var currentSHA = current.sha();
			repo.checkoutBranch(branch).then(function () {
				repo.getHeadCommit().then(function (latest) {
					var history = latest.history();

					history.on('end', function (commits) {
						handle(commits, repo, currentSHA, direction);
					});

					history.start();
				});
			});
		});
	});
};
