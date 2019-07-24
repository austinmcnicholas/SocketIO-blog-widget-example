import {
    defineWidget,
    log,
    runCallback,
} from 'widget-base-helpers';

import io from 'socket.io-client';


export default defineWidget('socketio-example', false, {
   
    socket: null,

    constructor() {
        this.log = log.bind(this);
        this.runCallback = runCallback.bind(this);
    },

    postCreate() {
        
        log.call(this, 'postCreate', this._WIDGET_VERSION);
        
    },

    update(obj, callback) {
        
        //the object the widget is in
         this._contextObj = obj;
        
        //connect to the feathers app using websockets as the transport method
        this.socket = io(this.url, {transports: ['websocket'], upgrade: false});

        const serviceName = this.service;
        const microflow = this.microflow;

        //listen to the created event for the service that is configured.
        this.socket.on(serviceName +  ' created', function(message){
            
            log.call(this, 'socket received something: ' + message, this._WIDGET_VERSION);

            //guid that was sent in the json request to the feathers app
            const messageGuid = message.text;
            //conext object guid
            const objGuid = obj.getGuid();

            //do the guids match? if so execute our microflow
            if (objGuid === messageGuid) {
            
                mx.data.action({
                    params: {
                        applyto: "selection",
                        actionname: microflow,
                        guids: [objGuid],
                    },
                    origin: this.mxform,
                    callback: function(response) {
                        // no MxObject expected
                            
                    },
                    error: function(error) {
                        //alert(error.message);
                    },
                    
                });
            }

          } ); 
        
        log.call(this, this.socket.connected, this._WIDGET_VERSION);

        if(callback) {callback();}
    },


    uninitialize() {
        
        //close the connection
        this.socket.close();

        log.call(this, 'Uninitialized?   ' + this.socket.disconnected, this._WIDGET_VERSION);
              
    },
});
