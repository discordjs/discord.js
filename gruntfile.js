module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // define source files and their destinations
        babel: {
            options: {
                loose: "all",
                compact: !grunt.option('dev')
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/**.*"],
                    dest: "lib/",
                    ext: ".js"
                }]
            }
        },
        browserify: {
            dist: {
                files: {
                    'web-dist/discord.<%= pkg.version %>.js': ["lib/index.js"],
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
                    "./web-dist/discord.min.<%= pkg.version %>.js": "./web-dist/discord.<%= pkg.version %>.js"
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
    grunt.registerTask("dist", ["babel", "browserify", "uglify"])

};