var https = require('https');

module.exports = function(RED) {
    function ExcursionNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.time = config.time;
        node.softmax = config.softmax;
        node.softmin = config.softmin;
        node.hardmax = config.hardmax;
        node.hardmin = config.hardmin;

        node.timeout = null;
        node.lastMsg = null;
        node.inExcursion = false;

        node.status({fill:"blue",shape:"ring",text:"Waiting for data"});

        function startTimer() {
            if( node.timeout == null ) {
                if (node.time) { // if there's a time set
                    node.log("Starting " + node.time + " second timer");
                    var delayMs = 1000 * node.time;
                    node.timeout = setTimeout(reportExcursion, delayMs);
                } else { // otherwise just report now
                    reportExcursion();
                }
            }
        }

        function stopTimer() {
            if( node.timeout != null ) {
                node.log("Stopping timer");
                clearTimeout(node.timeout);
                node.timeout = null;
            }
        }

        function reportExcursion() {
            node.status({fill:"red",shape:"dot",text:"Excursion! (" + lastMsg.payload + ")"});
            stopTimer();
            inExcursion = true;
            node.send(lastMsg);
        }

        function valueIsOutsideSoftLimits(value) {
            if( node.softmax && value > node.softmax ) {
                return true;
            }
            if( node.softmin && value < node.softmin ) {
                return true;
            }
            return false;
        }

        function valueIsOutsideHardLimits(value) {
            if( node.hardmax && value > node.hardmax ) {
                return true;
            }
            if( node.hardmin && value < node.hardmin ) {
                return true;
            }
            return false;
        }

        this.on('input', function(msg) {
            lastMsg = msg;
            var current = msg.payload;

            if( valueIsOutsideHardLimits(current) ) {
                node.log("Value exceeds hard limits: " + current);
                reportExcursion();
            } else if( valueIsOutsideSoftLimits(current) ) {
                node.log("Value exceeds soft limits: " + current);
                if (inExcursion) {
                    reportExcursion();
                } else {
                    node.status({fill:"yellow",shape:"dot",text:"Soft excursion... (" + current + ")"});
                    startTimer();
                }
            } else {
                node.status({fill:"green",shape:"dot",text:"OK (" + current + ")"});
                inExcursion = false;
                stopTimer();
            }
        });
    };

    RED.nodes.registerType("excursion",ExcursionNode, { });
};