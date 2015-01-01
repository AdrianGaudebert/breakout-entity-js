define(function () {
    var RenderingProcessor = function (manager, renderer, stage) {
        this.manager = manager;
        this.renderer = renderer;
        this.stage = stage;
    };

    RenderingProcessor.prototype.update = function (dt) {
        var sprites = this.manager.getEntitiesWithComponent('Sprite');

        for (var i in sprites) {
            var spriteData = sprites[i];
            var posData = this.manager.getEntityWithComponent(spriteData.__id, 'Ball');

            spriteData._sprite.x = posData.x;
            spriteData._sprite.y = posData.y;
        }

        this.renderer.render(this.stage);
    };

    return RenderingProcessor;
});
