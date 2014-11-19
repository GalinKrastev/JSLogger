// shim for forEach 
(function () {
    if (!Array.prototype.forEach){
        Array.prototype.forEach = function(fun /*, thisp*/){
            var len = this.length;
            if (typeof fun != "function") throw new TypeError();

            var thisp = arguments[1];
            for (var i = 0; i < len; i++){
                if (i in this) fun.call(thisp, this[i], i, this);
            }
        };
    }
})();

var MessageTypes = {
    Error: "Error",
    Warning: "Warning",
    Info: "Info"
}

var Messanger = {};
(function messanger (obj) {
    var messages = new Array();

    var getTimestamp = function () {
        var currentdate = new Date(); 
        var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

        return datetime;
    }

    var isValidMessage = function (strMessage) {
        if(strMessage == undefined || strMessage == "" || !typeof messages == "string")
            throw new TypeError("Parameter strMessage should have a value.");

        return true;
    }

    obj.getMessage = function (index) {
        return messages[index];
    }

    obj.logAllToConsole = function () {
        messages.forEach( function (m) {
            console.log(m);
        });

        return obj;
    }

    obj.addMessage = function (enumMessageType, strMessage) {
        if(isValidMessage(strMessage))
            messages.push({
                // message obj declaration
                type: enumMessageType,
                dateTime: getTimestamp(),
                message: strMessage,
                toHtml: function () {
                    var fragment = document.createDocumentFragment();
                    var br = document.createElement("br");
                    var m = document.createElement("span"); m.className = m.className + " " + this.type;
                    var t = document.createElement("time");

                    t.textContent = this.dateTime;
                    m.appendChild(t);

                    mText = document.createTextNode(" - " + this.message);
                    m.appendChild(mText);
                    
                    fragment.appendChild(m);
                    fragment.appendChild(br);

                    return fragment;
                }
            });

        return obj;
    }

    obj.getLastMessage = function () {
        return obj.getMessage(messages.length - 1);
    }

    obj.log = function (enumMessageType, message, containerElement) {
        obj.addMessage(enumMessageType, message);
        containerElement.appendChild(obj.getLastMessage().toHtml());

        containerElement.scrollTop = containerElement.scrollHeight;

        return obj;
    }

    obj.clear = function (containerElement) {
        messages = new Array();
        if(containerElement) {
            containerElement.innerHtml = "";
            containerElement.textContent = "";
        }

        return obj;
    }

    return obj;
})(Messanger);