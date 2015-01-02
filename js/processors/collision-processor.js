requirejs.config({
    baseUrl: 'js',
    paths: {
        'vendor': '../vendor'
    },
});

define(['lib/sat'], function (SAT) {
    var CollisionsProcessor = function (manager) {
        this.manager = manager;
        this._boxes = {};
    };

    CollisionsProcessor.prototype.update = function () {
        var movables = this.manager.getEntitiesWithComponent('Moving');
        var boundingBoxes = this.manager.getEntitiesWithComponent('BoundingBox');
        var element = null;
        var boundingBoxData = null;
        var areColliding = null;
        var movingElementData = null;
        var satElement = null;
        var collisionResponse = new SAT.Response();
        var boudingBoxId = null;

        for (var movableId in movables) {
            element = this.manager.getEntityWithComponent(movableId, 'BoundingBox');
            satElement = new SAT.Box(new SAT.Vector(element.x,element.y), element.width, element.height).toPolygon();

            for (var boudingBoxId in boundingBoxes) {
                boundingBoxData = this.manager.getEntityWithComponent(boudingBoxId, 'BoundingBox');

                if (boundingBoxData.__id !== element.__id) {

                    if (!this._boxes[boundingBoxData.__id]) {
                        this._boxes[boundingBoxData.__id] = new SAT.Box(
                            new SAT.Vector(boundingBoxData.x, boundingBoxData.y),
                            boundingBoxData.width, 
                            boundingBoxData.height
                        ).toPolygon();
                    }

                    var areColliding = SAT.testPolygonPolygon(satElement, this._boxes[boundingBoxData.__id], collisionResponse);

                    if (areColliding) {
                        movingElementData = this.manager.getEntityWithComponent(movableId, 'Moving');

                        if (collisionResponse.overlapN.x !== 0) {
                            debugger;
                            movingElementData.dx = movingElementData.dx * collisionResponse.overlapN.x;
                        }

                        if (collisionResponse.overlapN.y !== 0) {
                            movingElementData.dy = movingElementData.dy * collisionResponse.overlapN.y;
                        }

                        collisionResponse.clear();
                    }
                }
            }
        }
    };

    CollisionsProcessor.prototype.collisionsHandler = function () {

    };

    return CollisionsProcessor;
});
