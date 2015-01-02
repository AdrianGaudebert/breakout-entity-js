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
    'components/bounding-box',
    'components/moving',
    'processors/rendering-processor',
    'processors/physics-processor',
    'processors/collision-processor'
], function (
    PIXI,
    EntityManager,
    ProcessorManager,
    Ball,
    Sprite,
    BoundingBox,
    Moving,
    RenderingProcessor,
    PhysicsProcessor,
    CollisionProcessor
) {
    // Creation of the stage with PIXI.
    var stage = new PIXI.Stage(0x888888);
    var renderer = PIXI.autoDetectRenderer(640, 480);
    document.getElementById('stage').appendChild(renderer.view);

    function init() {
        // Loading of the components.
        var manager = new EntityManager();
        manager.addComponent(Ball.name, Ball);
        manager.addComponent(Sprite.name, Sprite);
        manager.addComponent(BoundingBox.name, BoundingBox);
        manager.addComponent(Moving.name, Moving);

        // Loading of the processors.
        var processors = new ProcessorManager();
        processors.addProcessor(new PhysicsProcessor(manager));
        processors.addProcessor(new RenderingProcessor(manager, renderer, stage));
        processors.addProcessor(new CollisionProcessor(manager));

        // Creation of the base entities.
        var ball = manager.createEntity(['Ball', 'Sprite', 'Moving', 'BoundingBox']);
        var spriteData = manager.getEntityWithComponent(ball, 'Sprite');
        spriteData.source = 'img/ball.png';

        var ballData = manager.getEntityWithComponent(ball, 'Ball');
        ballData.x = 640 / 2;
        ballData.y = 5;

        var ballBoudingBox = manager.getEntityWithComponent(ball, 'BoundingBox');
        ballBoudingBox.x = 640 / 2;
        ballBoudingBox.y = 0;
        ballBoudingBox.width = 20;
        ballBoudingBox.height = 20;

        var walls = [
            { x: 0, y: 0, width: 640, height: 20 },
            { x: 640, y: 40, width: 640, height: 20 },
            { x: -20, y: 0, width: 20, height: 480 },
            { x: 640, y: 0, width: 20, height: 480 }
        ];

        for (var i = walls.length - 1; i >= 0; i--) {
            var wall = manager.createEntity(['BoundingBox']);
            var wallData = manager.getEntityWithComponent(wall, 'BoundingBox');
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
