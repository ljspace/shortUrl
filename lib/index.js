var ShortUrl = function() {

    this.apiUrl = 'http://dwz.cn/create.php';
    this.data = null;
};

ShortUrl.prototype.fetch = function(longUrl) {
    this._httpRequest(this.apiUrl, longUrl);
};

ShortUrl.prototype._eventHandler = function() {

    var that = this,
        $container = document.getElementById('short-url'),
        success = this.data.status;

    $container.addEventListener('click', function(e) {
        if (success !== -1) {
            $container.className += ' finish';
            that.copyToClipboard(that.data.tinyurl);
        }
    });
};

ShortUrl.prototype._httpRequest = function(url, longUrl) {

    var xhr = new XMLHttpRequest(),
        that = this;

    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                that._setShortUrl(xhr.responseText);
            }
        }
    }

    xhr.send('url=' + longUrl);
};

ShortUrl.prototype._setShortUrl = function(urlObj) {

    var $url = document.getElementById('short-url');
    urlObj = urlObj || {};    
    this.data = JSON.parse(urlObj);
    
    if (this.data.status !== -1) {
        $url.innerText = this.data.tinyurl || '';
    } else {
        $url.innerText = this.data.err_msg || '';
    }

    this._eventHandler();
};

ShortUrl.prototype.copyToClipboard = function(text) {

    var input = document.getElementById('hidden-url');

    if (input == undefined){
        return;
    }

    input.value = text;
    input.select();

    document.execCommand('copy', false, null);
}

window.onload = function() {

    var shortUrl = new ShortUrl();

    chrome.tabs.getSelected(null, function(tab) {
        shortUrl.fetch(tab.url);
    });
}

