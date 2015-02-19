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
                dest: '../build/app/eventPage.js'
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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>  */\n',
                compress: {
                    drop_console: true // <-
                }
            },
            backend: {
                src: '../build/app/eventPage.js',
                dest: '../build/app/eventPage.min.js'
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
                      nonull:true,
                      src: '../system/**',
                      dest: '../build/system/',
                      filter: 'isFile'
                  },
                  {   nonull:true,
                      src: '../app/libs/jquery.sortable.js',
                      dest: '../build/app/libs/jquery.sortable.js',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../app/defaultTiles.json',
                      dest: '../build/app/defaultTiles.json',
                      filter:'isFile'
                  },
                  {   nonull:true,
                      src: '../app/searchTiles.json',
                      dest: '../build/app/searchTiles.json',
                      filter:'isFile'
                  },
                  {
                      expand: true,
                      src:  ['../manifest.json', '../icon.png', '../istartIcon.png', '../istartIcon16.png' ],
                      dest: '../build/*'
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
        },
        useminPrepare: {
            js: {
                src: ['../html/metro.html', '../html/popup.html'],
                options: {
                    dest: '../build/',
                    flow: {
                        steps: ['concat', 'uglify']
                    }
                }
            },
            css: {
                src: ['../html/metro.html', '../html/popup.html'],
                options: {
                    dest: '../'
                }
            }
        },
        usemin: {
            options: {
                blockReplacements: {
                    css: function (block) {
                        return '<link rel="stylesheet" href="' + block.dest.replace('/build', '') + '"/>';
                    },
                    js: function(block) {
                        return '<script src="'+ block.dest.replace('/build', '') +'"></script>';
                    }
                }
            },
            js: ['../build/html/metro.html', '../build/html/popup.html'],
            css: ['../build/html/metro.html', '../build/html/popup.html']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks("grunt-remove-logging");
    // Default task(s).
    ///grunt.registerTask('default', ['clean:pre','concat:build', 'concat:backend','uglify', 'clean:build']);
    grunt.registerTask('eventpage', ['concat:eventPage']);
    /**
     * create a concat
     * 'uglify:build',
     */
    grunt.registerTask('default', ['clean:pre', 'useminPrepare' , 'concat', 'copy', 'uglify' ,'cssmin' ,'usemin']);
};