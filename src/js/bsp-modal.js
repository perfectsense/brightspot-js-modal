import $ from 'jquery';
import bsp_utils from 'bsp-utils';
import vex from 'vex';

var bsp_modal = {

    defaults: {
        'id'    : 'modal',
        'theme' : 'default',
        'autoOpenHash' : 'slide-'
    },

    init: function($el, options) {

        var self = this;

        self.settings = $.extend({}, self.defaults, options);

        self.$el = $el;

        self._handleOpenLinks();
        self._handleCloseLinks();

        self.$el.attr('data-bsp-modal-' + self.settings.id,'');

        self.$el.data('bsp-modal', self);

        self._handleAutoOpenFromHash();

    },

    // this is fairly custom for base, but the idea is that if you have a special hash,
    // we will go ahead and auto open the modal. The default use case for this will be
    // to open the modal if there is a deep linkable slider in it and someone wants that
    // this can be changed by passing in an option for whatever we want the auto open hash to be
    _handleAutoOpenFromHash: function(){
        var self = this;

        if(window.location.hash.indexOf('#' + self.settings.autoOpenHash) > -1) {
            self._openFromDOM();
        }
    },

    // document delegates link clicks to open THIS modal and hit the public API when clicked
    _handleOpenLinks: function() {
        var self = this;

        $(document.body).on('click', '[data-bsp-modal-open=' + self.settings.id + ']', function() {
            self._openFromDOM(this);

            return false;
        });
    },

    // document delegates link clicks to close THIS modal and hit the public API when clicked
    _handleCloseLinks: function() {
        var self = this;

        $(document.body).on('click', '[data-bsp-modal-close=' + self.settings.id + ']', function() {
            self.close();

            return false;
        });
    },

    // private helper function to trigger events
    _trigger: function() {
        var self = this;
        var args = $.makeArray(arguments);
        var event = args.shift();
        args.unshift(this);

        if(self.$el) {
            self.$el.trigger.apply(self.$el, [event, args]);
        } else {
            $('body').trigger.apply($('body'), [event, args]);
        }
    },

    // passes through the vex events to create pretty native events for ourselves
    _addEvents: function() {
        var self = this;

        self.vexInstance.on('vexOpen', function(options) {
            self._trigger('bsp-modal:open', options);
        });

        self.vexInstance.on('vexClose', function(options) {
            // when we close replace the state just in case we had a hash
            if(window.location.hash !== '') {
                history.replaceState('', document.title, window.location.pathname);
            }
            self._trigger('bsp-modal:close', options);
        });
    },

    // private function that initializes modal centering
    _centerModal: function() {
        var self = this;

        self.recenter();

        // apply a throttled resize to keep up to date if we flip a device or resize the screen
        $(window).off('resize.bsp-modal').on('resize.bsp-modal', bsp_utils.throttle(250,function() {
            self.recenter();
        }));
    },

    // private function to open modal from the DOM. Calls the vex open method, but also sets up
    // the centering and passes though the events. Lastly, upon close, it puts everything back the
    // way it founded, leaving the DOM intact
    _openFromDOM: function(opener) {
        var self = this;
        // grab the modal data within that element
        var $modalData = self.$el.find('.modal-data').contents();
        // save it off, we're going to need to put it back
        var $savedContents = $modalData.clone();

        // if opened by a DOM element
        if(opener) {
            var $opener = $(opener);
            var href = $opener.attr('href');
            // if we have a anchor link, let that through
            if(href && href.indexOf('#') === 0) {
                window.location.hash = href;
            }
            self.$opener = $opener;
        }

        vex.defaultOptions.className = 'modal-theme-' + self.settings.theme + ' modal-' + self.settings.id;

        // when we do open the modal, grab the contents of the element and drop that into the modal
        // we do not want to do a clone here, as there can be clicks and other modules tied to this DOM
        self.vexInstance = vex.open({

            content: $modalData,

            // before we close those, put the stuff back (except for the close button of course)
            beforeClose: function() {
                self.vexInstance.find('.vex-close').remove();
                self.$el.find('.modal-data').html($savedContents);
            }

        });

        self._centerModal();

        self._addEvents();
    },

    // public API to interact with vex. You need to pass it a jquery content object and options unless you want the default theme and id
    open: function($content, options) {
        var self = this;

        var settings = $.extend({}, self.defaults, options);

        vex.defaultOptions.className = 'modal-theme-' + settings.theme + ' modal-' + settings.id;

        self.vexInstance = vex.open({
            content: $content
        });

        self._centerModal();

        self._addEvents();
    },

    // public API to close this instance of the modal
    close: function() {
        var self = this;

        vex.close(self.vexInstance.data().vex.id);
    },

    // public API that recenters the modal in the window screen (useful after content changes)
    // alternatively if the modal is bigger than the window, we have to CSS hack
    // the height of the overlay to cover the whole modal
    recenter: function() {
        var self = this;

        var contentHeight = self.vexInstance.outerHeight();
        var windowHeight = $(window).height();

        if(contentHeight > windowHeight) {
            self.vexInstance.css('margin-top', '');
            self.vexInstance.siblings('.vex-overlay').css('height', contentHeight);
        } else {
            self.vexInstance.css('margin-top', (windowHeight - contentHeight)/2);
            self.vexInstance.siblings('.vex-overlay').css('height', 'auto');
        }
    }

};

window.bspModal = bsp_modal;

export default bsp_modal;
