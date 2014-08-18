requirejs.config({
    baseUrl: 'js',
    paths: {
        'vendor': '../vendor'
    },
});

require(['vendor/entity-system-js/entity-manager'], function (EntityManager) {
    console.log("let's go!");

    var manager = new EntityManager();
});
