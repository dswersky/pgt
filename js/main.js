var app = {

    initialize: function() {
        var self = this;
        this.store = new MemoryStore(function() {
            self.route();
        });
        this.detailsURL = /^#employees\/(\d{1,})/;
        this.registerEvents();

    },

    showAlert: function(message, title) {
        if (navigator.notification){
            navigator.notification.alert(message, null, title, 'OK');
        }
        else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    registerEvents: function(){
        var self = this;
        //Check if browser supports touch events
        if (document.documentElement.hasOwnProperty('ontouchstart')) {
            //if yes, register touch event listener
            $('body').on('touchstart', 'a', function(event){
                $(event.target).addClass('tappable-active');
            });
            $('body').on('touchend','a',function(event) {
                $(event.target).removeClass('tappable-active');
            });
        } else {
            //if not, register mouse events
             $('body').on('mousedown', 'a', function(event){
                $(event.target).addClass('tappable-active');
            });
            $('body').on('mouseup','a',function(event) {
                $(event.target).removeClass('tappable-active');
            });
        }

        $(window).on('hashchange', $.proxy(this.route, this));
    },

    route: function() {
        var hash = window.location.hash;
        if (!hash) {
            $('body').html(new HomeView(this.store).render().el);
            return;
        }
        var match = hash.match(app.detailsURL);
        if (match) {
            this.store.findById(Number(match[1]), function(employee) {
                $('body').html(new EmployeeView(employee).render().el);
            });
        }
    }
};

app.initialize();