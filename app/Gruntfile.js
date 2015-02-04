module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                sourceMap: true

            },
            build: {
                src: ['*.js', 'controllers/*.js',
                        'directives/*.js',
                        'libs/*.js',
                        '!package.json',
                        '!Gruntfile.js',
                        '!eventPage.js',
                        '!backendScript/*'
                ],
                dest: '../build/app/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            backend: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    sourceMap: false
                },
                src: ['backendScript/bower_components/q/q.js',
                    'backendScript/*.js',
                    'node_modules/blueimp-md5/js/md5.js'
                ],
                dest: '../build/eventPage.js'
            },
            eventPage: {
                options: {
                    separator: ';',
                    stripBanners: true,
                    sourceMap: false
                },
                src: ['backendScript/bower_components/q/q.js',
                      'backendScript/*.js',
                      'node_modules/blueimp-md5/js/md5.js'
                ],
                dest: 'eventPage.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>  */\n'
            },
            build: {
                src: ['../build/*.js', '!eventPage.js'],
                dest: '../build/app/<%= pkg.name %>-<%= pkg.version %>.min.js'
            },
            backend: {
                src: '../build/eventPage.js',
                dest: '../build/eventPage.min.js'
            }
        },
        clean: {
            build: {
                    js: ["../build/*.js", "!../build/*.min.js", "!../build/*.js.map"]
            },
            pre: {
                src: ['../build/*']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    // Default task(s).
    grunt.registerTask('default', ['clean:pre','concat:build', 'concat:backend','uglify', 'clean:build']);
    grunt.registerTask('eventpage', ['concat:eventPage']);
    /**
     * create a concat
     */
    grunt.registerTask('default', ['clean:pre', 'concat:build', 'concat:backend','uglify', 'clean:build']);
};