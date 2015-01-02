requirejs.config({
    baseUrl: 'js',
    paths: {
        'vendor': '../vendor'
    },
});

require([
    'lib/pixi',
    'lib/sat',
    'vendor/entity-system-js/entity-manager',
    'vendor/entity-system-js/processor-manager',
    'components/ball',
    'components/sprite',
    'components/bounding-box',
    'components/moving',
    'processors/rendering-processor',
    'processors/collision-processor',
    'processors/moving-processor'
], function (
    PIXI,
    SAT,
    EntityManager,
    ProcessorManager,
    Ball,
    Sprite,
    BoundingBox,
    Moving,
    RenderingProcessor,
    CollisionProcessor,
    MovingProcessor
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
        processors.addProcessor(new MovingProcessor(manager));
        processors.addProcessor(new CollisionProcessor(manager));
        processors.addProcessor(new RenderingProcessor(manager, renderer, stage));

        // Creation of the base entities.
        var background = manager.createEntity(['Sprite', 'BoundingBox']);
        var backSpriteData = manager.getEntityWithComponent(background, 'Sprite');
        backSpriteData.source = 'img/background.png';

        var ball = manager.createEntity(['Ball', 'Sprite', 'Moving', 'BoundingBox']);
        var spriteData = manager.getEntityWithComponent(ball, 'Sprite');
        spriteData.source = 'img/ball.png';

        var ballBoundingBox = manager.getEntityWithComponent(ball, 'BoundingBox');
        ballBoundingBox.x = 640 / 2;
        ballBoundingBox.y = 0;
        ballBoundingBox.width = 16;
        ballBoundingBox.height = 16;

        var walls = [
            { x: 0, y: -20, width: 640, height: 20 },
            { x: 640, y: 0, width: 20, height: 480 },
            { x: 0, y: 480, width: 640, height: 20 },
            { x: -20, y: 0, width: 20, height: 480 }
        ];

        for (var i = walls.length - 1; i >= 0; i--) {
            var wall = manager.createEntity(['BoundingBox']);
            var wallData = manager.getEntityWithComponent(wall, 'BoundingBox');
            wallData.x = walls[i].x;
            wallData.y = walls[i].y;
            wallData.width = walls[i].width;
            wallData.height = walls[i].height;
        }

        // Timing of the game and FPS.
        var lastFrame = +new Date();
        var averageFrameTime = 0;

        // Main loop.
        requestAnimFrame(animate);
        function animate() {
            var now = +new Date();
            var elapsedTime = now - lastFrame;

            averageFrameTime += (elapsedTime - averageFrameTime) / 20;

            lastFrame = now;

            processors.update(elapsedTime);
            requestAnimFrame(animate);
        }

        var fpsElt = document.getElementById('fps');
        setInterval(function () {
            fpsElt.innerHTML = (1000 / averageFrameTime).toFixed(1) + ' fps';
        }, 1000);
    }

    init();
});
