requirejs.config({
    baseUrl: 'js',
    paths: {
        'vendor': '../vendor'
    },
});

require([
    'vendor/entity-system-js/entity-manager',
    'vendor/entity-system-js/processor-manager',

    'components/ball',
    'components/brick',
    'components/sprite',
    'components/bounding-box',
    'components/moving',

    'processors/rendering-processor',
    'processors/collision-processor',
    'processors/moving-processor'
], function (
    EntityManager,
    ProcessorManager,

    Ball,
    Brick,
    Sprite,
    BoundingBox,
    Moving,

    RenderingProcessor,
    CollisionProcessor,
    MovingProcessor
) {
    function init() {
        // Loading of the components.
        var manager = new EntityManager();

        // Add all components to the system.
        var components = [
            Ball,
            Brick,
            Sprite,
            BoundingBox,
            Moving,
        ];
        for (var i = components.length - 1; i >= 0; i--) {
            manager.addComponent(components[i].name, components[i]);
        }

        // Loading of the processors.
        // Note: order matters! Rendering should always be last.
        var processors = new ProcessorManager();
        processors.addProcessor(new MovingProcessor(manager));
        processors.addProcessor(new CollisionProcessor(manager));
        processors.addProcessor(new RenderingProcessor(manager));

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

        var brick = manager.createEntity(['Brick', 'Sprite', 'BoundingBox']);
        var brickSpriteData = manager.getEntityWithComponent(brick, 'Sprite');
        brickSpriteData.source = 'img/brick.png';

        var brickBox = manager.getEntityWithComponent(brick, 'BoundingBox');
        brickBox.x = 640 / 2 - 24;
        brickBox.y = 200;
        brickBox.width = 48;
        brickBox.height = 16;

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
