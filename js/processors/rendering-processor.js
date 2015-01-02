define([
'lib/pixi',
], function (PIXI) {
    var RenderingProcessor = function (manager) {
        this.manager = manager;

        // Creation of the stage with PIXI.
        this.stage = new PIXI.Stage(0x888888);
        this.renderer = PIXI.autoDetectRenderer(640, 480);
        document.getElementById('stage').appendChild(this.renderer.view);

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

            var posData = this.manager.getEntityWithComponent(id, 'BoundingBox');

            this._sprites[id].x = Math.round(posData.x);
            this._sprites[id].y = Math.round(posData.y);
        }

        this.renderer.render(this.stage);
    };

    RenderingProcessor.prototype.createSprite = function (spriteData) {
        var texture = PIXI.Texture.fromImage(spriteData.source);
        var sprite = new PIXI.Sprite(texture);

        this.stage.addChild(sprite);
        this._sprites[spriteData.__id] = sprite;
    };

    return RenderingProcessor;
});
