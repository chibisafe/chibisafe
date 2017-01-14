var http = function (url, success, failure) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            if (request.status == 200)
                success(request.responseText);
            else if (failure)
                failure(request.status, request.statusText);
        }
    };
};
var mockXhr = function () {
    XMLHttpRequest = XhrMock;
    FormData = FormDataMock;
};
var resolveEnvironment = function () {
    if (window.location.href.toString().toLowerCase().indexOf('file://') >= 0) {
        mockXhr();
        return;
    }
    http('api/check', function (result) {
        if (result !== 'API OK')
            mockXhr();
    }, function () {
        mockXhr();
    });
};
var FormDataMock = (function () {
    function FormDataMock() {
        this.data = {};
    }
    FormDataMock.prototype.append = function (key, data, additional) {
        this.data[key] = { data: data, additional: additional };
    };
    return FormDataMock;
})();
var XhrMock = (function () {
    function XhrMock() {
        this.loaded = 0;
        this.step = 2000000;
        this.readyState = 0;
        this.status = 0;
        this.upload = { onprogress: function () { } };
    }
    XhrMock.prototype.open = function (method, url, async) {
    };
    XhrMock.prototype.setRequestHeader = function (name, value) {
    };
    XhrMock.prototype.send = function (formData) {
        this.file = formData.data['file'].data;
        this.performStep();
    };
    XhrMock.prototype.abort = function () {
        window.clearTimeout(this.timeoutId);
    };
    XhrMock.prototype.performStep = function () {
        var _this = this;
        this.timeoutId = window.setTimeout(function () {
            if (_this.addStep() === _this.file.size) {
                _this.readyState = 4;
                _this.status = 200;
                _this.onload(new Event('loaded'));
            }
            else {
                var e = {
                    lengthComputable: true,
                    loaded: _this.loaded,
                    total: _this.file.size
                };
                _this.upload.onprogress(e);
                _this.performStep();
            }
        }, 100);
    };
    XhrMock.prototype.addStep = function () {
        var newValue = this.loaded + this.step;
        this.loaded = newValue > this.file.size ? this.file.size : newValue;
        return this.loaded;
    };
    return XhrMock;
})();
