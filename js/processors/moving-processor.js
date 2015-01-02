define(function () {
    var MovingProcessor = function (manager) {
        this.manager = manager;
    };

    MovingProcessor.prototype.update = function () {
        var boudingBoxElement = null;
        var movables = this.manager.getEntitiesWithComponent('Moving');

        for (var movable in movables) {
            boudingBoxElement = this.manager.getEntityWithComponent(movable, 'BoundingBox');
            this.moveElement(movables[movable], boudingBoxElement);
        }
    };

    MovingProcessor.prototype.moveElement = function (movingData, boudingBoxData) {
        boudingBoxData.x = boudingBoxData.x + (movingData.dx * movingData.speed);
        boudingBoxData.y = boudingBoxData.y + (movingData.dy * movingData.speed);
    };

    return MovingProcessor;
});
