define(function () {
    var MovingProcessor = function (manager) {
        this.manager = manager;
    };

    MovingProcessor.prototype.update = function (dt) {
        var movables = this.manager.getEntitiesWithComponent('Moving');
        var elapsedTime = dt / 1000.0;  // in seconds

        for (var id in movables) {
            var moveData = movables[id];
            var posData = this.manager.getEntityWithComponent(id, 'BoundingBox');

            posData.x = posData.x + (moveData.dx * moveData.speed * elapsedTime);
            posData.y = posData.y + (moveData.dy * moveData.speed * elapsedTime);
        }
    };

    return MovingProcessor;
});
