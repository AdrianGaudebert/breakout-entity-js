define(function () {
    var RenderingProcessor = function (manager, renderer, stage) {
        this.manager = manager;
        this.renderer = renderer;
        this.stage = stage;
    };

    RenderingProcessor.prototype.update = function () {
        this.renderer.render(this.stage);
    };

    return RenderingProcessor;
});
