define(function () {
    var BallProcessor = function (manager) {
        this.manager = manager;
    };

    BallProcessor.prototype.update = function () {
        var balls = this.manager.getEntitiesWithComponent('Ball');

        for (var i = balls.length - 1; i >= 0; i--) {
            balls[i].x += balls[i].dx;
            balls[i].y += balls[i].dy;
        }
    };

    return BallProcessor;
});
