var ShortUrl = function() {
    this.apiUrl = 'http://dwz.cn/create.php';
    this.data = null;
};

ShortUrl.prototype.fetch = function(longUrl) {
    this._httpRequest(this.apiUrl, longUrl);
};

ShortUrl.prototype._eventHandler = function() {

    var that = this,
        $url = document.getElementById('short-url');

    $url.addEventListener('click', function(e) {
        if (that.data.status !== -1) {
            that.copyToClipboard(that.data.tinyurl);
            $url.className += ' finish';
            $url.innerText = '短地址已复杂到剪贴板';
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
                that._setShortUrl(JSON.parse(xhr.responseText));
            } else {
                that._setShortUrl({
                    status: -1,
                    err_msg: '网络连接异常，请检查'
                });
            }
        }
    }

    xhr.send('url=' + longUrl);
};

ShortUrl.prototype._setShortUrl = function(urlObj) {

    var $url = document.getElementById('short-url');
    this.data = urlObj;

    if (this.data.status !== -1) {
        $url.innerText = this.data.tinyurl || '';
        this._eventHandler();
    } else {
        $url.className += ' error';
        $url.innerText = this.data.err_msg || '';
    }
};

ShortUrl.prototype.copyToClipboard = function(text) {

    var input = document.getElementById('hidden-url');
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