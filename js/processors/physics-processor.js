define(function () {
    var PhysicsProcessor = function (manager) {
        this.manager = manager;
    };

    PhysicsProcessor.prototype.update = function (dt) {
        var ball;
        var destX;
        var destY;

        var balls = this.manager.getEntitiesWithComponent('Ball');
        var walls = this.manager.getEntitiesWithComponent('Wall');

        for (var b in balls) {
            ball = balls[b];

            destX = ball.x + (ball.dx * ball.speed);
            destY = ball.y + (ball.dy * ball.speed);

            // Check collisions with walls.
            for (var w in walls) {
                var wall = walls[w];

                if (this.circleRectangleCollide(ball, wall)) {
                    var bouncing = this.bounces(ball, wall);
                    if (bouncing.bounce) {
                        console.log('BOUNCING ON THE WALLS');
                    }
                }
            }

            ball.x = destX;
            ball.y = destY;
        }
    };

    PhysicsProcessor.prototype.circleRectangleCollide = function (circle, rect) {
        // compute a center-to-center vector
        var half = {
            x: rect.width / 2,
            y: rect.height / 2
        };
        var center = {
            x: circle.x - (rect.x + half.x),
            y: circle.y - (rect.y + half.y)
        };

        // check circle position inside the rectangle quadrant
        var side = {
            x: Math.abs(center.x) - half.x,
            y: Math.abs(center.y) - half.y
        };

        if (side.x >  circle.r || side.y >  circle.r) {
            // outside
            return false;
        }
        if (side.x < -circle.r && side.y < -circle.r) {
            // inside
            return true;
        }
        if (side.x < 0 || side.y < 0) {
            // intersects side or corner
            return true;
        }

        // circle is near the corner
        return ((side.x * side.x) + (side.y * side.y))  < circle.r * circle.r;
    };


    PhysicsProcessor.prototype.bounces = function (rect, circle) {
        // compute a center-to-center vector
        var half = {
            x: rect.width / 2,
            y: rect.height / 2
        };
        var center = {
            x: circle.x - (rect.x + half.x),
            y: circle.y - (rect.y + half.y)
        };

        // check circle position inside the rectangle quadrant
        var side = {
            x: Math.abs(center.x) - half.x,
            y: Math.abs(center.y) - half.y
        };

        if (side.x >  circle.r || side.y >  circle.r) {
            // outside
            return { bounce: false };
        }
        if (side.x < -circle.r && side.y < -circle.r) {
            // inside
            return { bounce: false };
        }
        if (side.x < 0 || side.y < 0) {
            // intersects side or corner
            var dx = 0;
            var dy = 0;
            if (Math.abs(side.x) < circle.r && side.y < 0) {
                dx = (center.x * side.x) < 0 ? -1 : 1;
            }
            else if (Math.abs(side.y) < circle.r && side.x < 0) {
                dy = (center.y * side.y) < 0 ? -1 : 1;
            }

            return {
                bounce: true,
                x: dx,
                y: dy
            };
        }

        // circle is near the corner
        bounce = (side.x * side.x) + (side.y * side.y)  < (circle.r * circle.r);
        if (!bounce) {
            return {
                bounce: false
            };
        }

        var norm = Math.sqrt (side.x*side.x+side.y*side.y);
        var dx = center.x < 0 ? -1 : 1;
        var dy = center.y < 0 ? -1 : 1;
        return {
            bounce: true,
            x: dx * side.x / norm,
            y: dy * side.y / norm
        };
    }


    return PhysicsProcessor;
});
