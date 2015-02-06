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
                src: ['*.js',
                        'controllers/*.js',
                        'directives/*.js',
                        'libs/*.js',
                        '!package.json',
                        '!Gruntfile.js',
                        '!eventPage.js',
                        '!backendScript/*',
                        '../bower_components/jquery/dist/jquery.js',
                        '../bower_components/jquery-ui/jquery-ui.js',
                        '../bower_components/angular/angular.js',
                        'bower_components/angular-aria/angular-aria.js',
                        'bower_components/angular-animate/angular-animate.js',
                        'bower_components/hammerjs/hammer.js',
                        'bower_components/angular-material/angular-material.js',
                        '../bower_components/angular-route/angular-route.js',
                        '../bower_components/angular-ui-router/release/angular-ui-router.js',
                        '../bower_components/angular-dragdrop/src/angular-dragdrop.js'
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
        copy: {
          build: {
              files: [
                  { nonull:true,
                      src: '../html/**',
                      dest: '../build/html/',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../css/**',
                      dest: '../build/css/',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../font/**',
                      dest: '../build/font/',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../fonts/**',
                      dest: '../build/fonts/',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../img/**',
                      dest: '../build/img/',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../am/**',
                      dest: '../build/am/',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../_locales/**',
                      dest: '../build/locales/',
                      filter:'isFile'
                  },
                  {
                      expand: true,
                      src :['../manifest.json', '../icon.png', '../istartIcon.png', 'istartIcon16.png'],
                      dest :'../build/'
                  }

                ]
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    // Default task(s).
    ///grunt.registerTask('default', ['clean:pre','concat:build', 'concat:backend','uglify', 'clean:build']);
    grunt.registerTask('eventpage', ['concat:eventPage']);
    /**
     * create a concat
     */
    grunt.registerTask('default', ['clean:pre', 'concat:build', 'concat:backend','uglify', 'copy:build' ,'clean:build']);
};