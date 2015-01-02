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
    'components/sprite',
    'components/wall',
    'processors/rendering-processor',
    'processors/physics-processor'
], function (
    PIXI,
    EntityManager,
    ProcessorManager,
    Ball,
    Sprite,
    Wall,
    RenderingProcessor,
    PhysicsProcessor
) {
    // Creation of the stage with PIXI.
    var stage = new PIXI.Stage(0x888888);
    var renderer = PIXI.autoDetectRenderer(640, 480);
    document.getElementById('stage').appendChild(renderer.view);

    function init() {
        // Loading of the components.
        var manager = new EntityManager();
        manager.addComponent(Ball.name, Ball);
        manager.addComponent(Wall.name, Wall);
        manager.addComponent(Sprite.name, Sprite);

        // Loading of the processors.
        var processors = new ProcessorManager();
        processors.addProcessor(new PhysicsProcessor(manager));
        processors.addProcessor(new RenderingProcessor(manager, renderer, stage));

        // Creation of the base entities.
        var ball = manager.createEntity(['Ball', 'Sprite']);
        var spriteData = manager.getEntityWithComponent(ball, 'Sprite');
        spriteData.source = 'img/ball.png';

        var ballData = manager.getEntityWithComponent(ball, 'Ball');
        ballData.x = 640 / 2;
        ballData.y = 50;

        var walls = [
            { x: 0, y: -20, width: 640, height: 20 },
            { x: 640, y: 480, width: 640, height: 20 },
            { x: -20, y: 0, width: 20, height: 480 },
            { x: 640, y: 0, width: 20, height: 480 },
        ];
        for (var i = walls.length - 1; i >= 0; i--) {
            var wall = manager.createEntity(['Wall']);
            var wallData = manager.getEntityWithComponent(wall, 'Wall');
            wallData.x = walls[i].x;
            wallData.y = walls[i].y;
            wallData.width = walls[i].width;
            wallData.height = walls[i].height;
        }

        // Main loop.
        requestAnimFrame(animate);
        function animate() {
            requestAnimFrame(animate);

            processors.update();
        }
    }

    init();
});
