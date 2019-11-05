module.exports = function (grunt) {
    grunt.initConfig({
        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),
        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " *  <%= pkg.description %>\n" +
                " *  <%= pkg.homepage %>\n" +
                " *\n" +
                " *  Made by <%= pkg.author.name %>\n" +
                " *  Under <%= pkg.license %> License\n" +
                " */\n"
        },
        // Concat definitions
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                src: ["src/<%=  pkg.name %>.js"],
                dest: "dist/<%=  pkg.name %>.js"
            }
        },
        //Concat css definitions
        concat_css: {
            options: {},
            all: {
                src: ["src/*.css"],
                dest: "dist/<%=  pkg.name %>.css"
            },
        },
        // Minify definitions
        uglify: {
            dist: {
                src: ["dist/<%=  pkg.name %>.js"],
                dest: "dist/<%=  pkg.name %>.min.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        // Minify css
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist',
                    ext: '.min.css'
                },
                {
                    expand: true,
                    cwd: 'src/themes',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/themes',
                    ext: '.min.css'
                }]
            }
        },
        // CoffeeScript compilation
        coffee: {
            compile: {
                files: {
                    "dist/<%=  pkg.name %>.js": "src/<%=  pkg.name %>.coffee"
                }
            }
        },
        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            default: {
                files: ["src/*", "test/**/*"],
                tasks: ["default"],
            },
            build: {
                files: ["src/*", "test/**/*"],
                tasks: ["buildFull"],
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-coffee");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.registerTask("build", ["concat", "uglify", "concat_css", "cssmin"]);
    grunt.registerTask("default", ["build"]);
    grunt.registerTask("buildFull", ["build"]);
};
