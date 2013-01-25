NEWSBLUR.ReaderPopover = Backbone.View.extend({
    
    _open: false,
    
    events: {
        "click .NB-modal-cancel": "close"
    },
    
    initialize: function(options) {
        this.options = _.extend({}, {
            animate: true,
            offset: {
                top: 0,
                left: 0
            }
        }, this.options, options);
        console.log(["options", options, this.options]);
        this.render();
    },
    
    render: function() {
        var self = this;
        this._open = true;
        console.log(["popover render", this.$el, this.options]);
        var $popover = $.make("div", { className: "NB-popover popover fade" }, [
            $.make('div', { className: "arrow" }),
            $.make('div', { className: "popover-inner" }, [
                $.make('div', { className: "popover-content" }, [
                    this.$el
                ])
            ])
        ]);
        this.setElement($popover);
        
        $('body').append(this.$el);
        
        this.$el.addClass(this.options.placement.replace('-', '').replace(' ', '-'));
        this.$el.align(this.options.anchor(), this.options.placement, this.options.offset);
        this.$el.autohide({
            clickable: true,
            onHide: _.bind(this.close, this)
        });
        
        if (this.options.animate) {
            this.$el.addClass("in");
        }
        
        return this;
    },
    
    close: function(e, hide_callback) {
        console.log(["close", hide_callback, this.$el, $.support.transition, this.$el.hasClass('fade')]);
        var $el = this.$el;
        var self = this;
        if (_.isFunction(e)) hide_callback = e;
        hide_callback = hide_callback || $.noop;
        this.$el.removeClass('in');
        this.options.on_hide && this.options.on_hide();

        function removeWithAnimation() {
            var timeout = setTimeout(function () {
                console.log(["transition timeout", $el]);
                $el.off($.support.transition.end);
                self._open = false;
                self.remove();
                hide_callback();
            }, 500);

            $el.one($.support.transition.end, function () {
                clearTimeout(timeout);
                self._open = false;
                self.remove();
                hide_callback();
                console.log(["transition end", $el]);
            });
        }

        if ($.support.transition && this.$el.hasClass('fade')) {
            removeWithAnimation();
        } else {
            this._open = false;
            this.remove();
            hide_callback();
        }
        
        return false;
    }
    
});