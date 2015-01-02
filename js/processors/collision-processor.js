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
        var boundingBoxData = null;
        var areColliding = null;
        var movingElementData = null;
        var satElement = null;
        var collisionResponse = new SAT.Response();

        for (var movableId in movables) {
            var movableBoxData = this.manager.getEntityWithComponent(movableId, 'BoundingBox');
            satElement = new SAT.Box(
                new SAT.Vector(movableBoxData.x, movableBoxData.y), 
                movableBoxData.width, 
                movableBoxData.height
            ).toPolygon();

            for (var id in boundingBoxes) {
                boundingBoxData = this.manager.getEntityWithComponent(id, 'BoundingBox');

                if (id !== movableId) {

                    if (!this._boxes[id]) {
                        this._boxes[id] = new SAT.Box(
                            new SAT.Vector(boundingBoxData.x, boundingBoxData.y),
                            boundingBoxData.width, 
                            boundingBoxData.height
                        ).toPolygon();
                    }

                    var areColliding = SAT.testPolygonPolygon(satElement, this._boxes[id], collisionResponse);

                    if (areColliding) {
                        movingData = movables[movableId];

                        if (collisionResponse.overlapN.x !== 0) {
                            movingData.dx = movingData.dx * -1;
                        }

                        if (collisionResponse.overlapN.y !== 0) {
                            movingData.dy = movingData.dy * -1;
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
