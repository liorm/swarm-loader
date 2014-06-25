'use strict';

module.exports = function (grunt) {

    // Show elapsed time at the end
    require('time-grunt')(grunt);

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        // Compiles TS to JS and generates necessary files if requested
        typescript: {
            server: {
                src: ['shared/**/*.ts', 'lib/**/*.ts', 'app/**/*.ts'],
                options: {
                    module: 'commonjs',
                    target: 'es3',
                    basePath: '.',
                    sourceMap: true,
                    declaration: false
                }
            }
        }
    });

    grunt.registerTask('build', [
        'typescript:server'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
