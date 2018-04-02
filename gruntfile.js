module.exports = (grunt) => {
  grunt.initConfig({
    jshint: {
      options: {
        "esversion": 6
      },
      files: {
        src: ['server/**/*.js']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

}