define([
'lib/pixi',
], function (PIXI) {
    var RenderingProcessor = function (manager, renderer, stage) {
        this.manager = manager;
        this.renderer = renderer;
        this.stage = stage;

        // A dictionary associating entities with their respective sprite.
        // entity id -> sprite
        this._sprites = {};
    };

    RenderingProcessor.prototype.update = function (dt) {
        var sprites = this.manager.getEntitiesWithComponent('Sprite');

        for (var id in sprites) {
            var spriteData = sprites[id];

            if (!this._sprites[id]) {
                // If the sprite object does not exist yet, let's create it.
                this.createSprite(spriteData)
            }

            var posData = this.manager.getEntityWithComponent(id, 'Ball');

            this._sprites[id].x = posData.x;
            this._sprites[id].y = posData.y;
        }

        this.renderer.render(this.stage);
    };

    RenderingProcessor.prototype.createSprite = function (spriteData) {
        var texture = PIXI.Texture.fromImage(spriteData.source);
        var sprite = new PIXI.Sprite(texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        this.stage.addChild(sprite);
        this._sprites[spriteData.__id] = sprite;
    };

    return RenderingProcessor;
});
