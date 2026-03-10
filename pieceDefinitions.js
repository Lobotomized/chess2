if (typeof window !== 'undefined') {
    const scripts = [
        '/pieces/classic.js',
        '/pieces/bugs.js',
        '/pieces/animals.js',
        '/pieces/cats.js',
        '/pieces/medieval.js',
        '/pieces/machines.js',
        '/pieces/misc.js',
        '/pieces/rogueLike.js'
    ];

    scripts.forEach(function(scriptUrl) {
        document.write('<script src="' + scriptUrl + '"><\/script>');
    });
} else {
    try {
        var classic = require('./pieces/classic.js');
        var bugs = require('./pieces/bugs.js');
        var animals = require('./pieces/animals.js');
        var cats = require('./pieces/cats.js');
        var medieval = require('./pieces/medieval.js');
        var machines = require('./pieces/machines.js');
        var misc = require('./pieces/misc.js');
        var rogueLike = require('./pieces/rogueLike.js');

        module.exports = {
            ...classic,
            ...bugs,
            ...animals,
            ...cats,
            ...medieval,
            ...machines,
            ...misc,
            ...rogueLike
        };
    } catch (e) {
    }
}
