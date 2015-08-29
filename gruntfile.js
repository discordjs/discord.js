module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // define source files and their destinations
        babel: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**.*"],
                    dest: "lib/",
                    ext: ".js"
                }]
            }
        },
        browserify: {
            dist: {
                files: {
                    'web-dist/discord.js': ["lib/index.js"],
                },
                options: {
                    browserifyOptions: {
                        standalone: "Discord"
                    }
                }
            }
        },
        uglify: {
            min: {
                files: {
                    "./web-dist/discord.min.js": "./web-dist/discord.js"
                }
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // register at least this one task
    grunt.registerTask('default', ['babel']);
    grunt.registerTask('web', ['browserify', "uglify"]);

};