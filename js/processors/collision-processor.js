define(function () {
    var CollisionsProcessor = function (manager) {
        this.manager = manager;
    };

    CollisionsProcessor.prototype.update = function () {
        var movables = this.manager.getEntitiesWithComponent('Moving');
        var boundingBoxes = this.manager.getEntitiesWithComponent('BoundingBox');
        var element = null;
        var boudingBoxElement = null;
        var areColliding = null;
        var movingElement = null;

        for (var movable in movables) {
            element = this.manager.getEntityWithComponent(movable, 'BoundingBox');

            for (var boudingBox in boundingBoxes) {
                boudingBoxElement = this.manager.getEntityWithComponent(boudingBox, 'BoundingBox');

                if (boudingBoxElement.__id !== element.__id) {
                    areColliding = this.areColliding(element, boudingBoxElement);

                    if (areColliding) {
                        var movingElement = this.manager.getEntityWithComponent(movable, "Moving");
                        movingElement.dy = movingElement.dy * -1;
                        movingElement.dx = movingElement.dx * -1;
                    }
                }
            }
        }
    };

    CollisionsProcessor.prototype.areColliding = function(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.height + rect1.y > rect2.y) {
                return true;
        }

        return false;
    };

    CollisionsProcessor.prototype.collisionsHandler = function () {

    };

    return CollisionsProcessor;
});
