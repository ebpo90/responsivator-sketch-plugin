/**
 * This script basically just runs through all source files and
 * prints out a list of files and lines where it found the TODO
 * keyword
 */
var fs = require('fs-extra');
var chalk = require('chalk');

var base = null;
var todoCnt = 0;
var searchRegEx = /TODO(.*)/g;

function readDir(dirPath) {
  var list = fs.readdirSync(dirPath);
  list.forEach(function (fileName) {
    var fullPath = dirPath + '/' + fileName;
    var stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      readDir(fullPath)
    } else if (stats.isFile()) {
      var data = fs.readFileSync(fullPath, "utf-8");
      var matchFile = data.match(searchRegEx);
      if (matchFile && matchFile.length > 0) {
        console.log('\n' + chalk.underline(fullPath + ': '))
        data.split('\n').forEach(function (lineContent, line) {
          var matchLine = lineContent.match(searchRegEx);
          if (matchLine && matchLine.length > 0) {
            matchLine.forEach(function (match) {
              todoCnt++;
              console.log(chalk.gray(' *:' + (line + '      ').substring(0, 6)) + match)
            });
          }
        });
      }
    }
  })
}

readDir('./src');
if (todoCnt > 0) {
  console.log(chalk.red(chalk.bold('\n✖ ' + todoCnt + ' todos found in code\n')));
} else {
  console.log(chalk.green(chalk.bold('\nGreat, seems you are todo-free\n')));
}