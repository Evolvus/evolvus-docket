/*
 ** Normally we would use dist folder for distribution code
 ** but since we are coming from the java world - "target" folder
 ** is more relevant to us. (default output folder of a maven job)
 **
 ** grunt clean => mvn clean
 **
 */

module.exports = (grunt) => {

  grunt.initConfig({
    env: {
      test: {
        DEBUG: "evolvus-docket*"
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
        },
        src: ["test/index.js"]
      }
    },
    jshint: {
      options: {
        "esversion": 6
      },
      files: {
        src: ["gruntfile.js", "index.js", "db/*.js", "test/index.js", "test/**/*.js", "model/*.js"]
      }
    },
    watch: {
      files: ["<%= jshint.files.src %>"],
      tasks: ["jshint", "mochaTest"]
    }
  });

  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  //grunt.registerTask("ci-build", ["clean", "jshint", "copy", "mochaTest:coverage"]);
  grunt.registerTask("default", ["jshint", "env:test", "mochaTest"]);
};