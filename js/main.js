requirejs.config({
    baseUrl: 'js',
    paths: {
        'vendor': '../vendor'
    },
});

require([
    'lib/pixi',
    'vendor/entity-system-js/entity-manager',
    'vendor/entity-system-js/processor-manager',
    'components/ball',
    'processors/rendering-processor',
    'processors/ball-processor'
], function (
    PIXI,
    EntityManager,
    ProcessorManager,
    Ball,
    RenderingProcessor,
    BallProcessor
) {
    // Creation of the stage with PIXI.
    var stage = new PIXI.Stage(0x888888);
    var renderer = PIXI.autoDetectRenderer(640, 480);
    document.getElementById('stage').appendChild(renderer.view);

    function init() {
        // Loading of the components.
        var manager = new EntityManager();
        manager.addComponent(Ball.name, Ball);

        // Loading of the processors.
        var processors = new ProcessorManager();
        processors.addProcessor(new RenderingProcessor(manager, renderer, stage));
        processors.addProcessor(new BallProcessor(manager));

        // Creation of the base entities.
        manager.createEntity(['Ball']);

        // Main loop.
        requestAnimFrame(animate);
        function animate() {
            requestAnimFrame(animate);

            processors.update();
        }
    }

    init();
});
