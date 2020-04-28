var extensionLoaded = false;
document.addEventListener('DOMContentLoaded', function () {
    if (extensionLoaded) return;
    else extensionLoaded = true;

    function log(msg, ret) {
        var tag = "[" + chrome.runtime.getManifest().short_name + "]";
        if (ret) return tag + " " + msg;
        else console.debug(tag, msg);
    }

    function init() {
        initDisqusHtml();
        initCommentCounter();
        initDisqusJs();
        log("enabled comments");
    }

    function initCommentCounter() {
        var el = document.querySelector("div.share.others");
        el.insertAdjacentHTML("afterbegin", `
            <div class="item comment">
                <a class="icon" title="Írjon hozzászólást" href="#article-comments" data-event-name="ClickOnCommentIcon"></a>
                <span class="disqus-comment-count" style="white-space:normal;line-height:100%" data-disqus-url="` + location.protocol + "//" + location.host + location.pathname + `"></span>
            </div>`);
    }

    function initDisqusHtml() {
        var pe = document.querySelector("div.random-article-page-box");
        pe.insertAdjacentHTML("beforebegin", `
            <div class="site-disqus-holder hvgcomments" id="article-comments" data-scroll-event-name="ScrollToArticleDisqus">
                <div class="heading-with_line"><span>Hozzászólások</span></div>
                <div class="site-disqus">
                    <div id="disqus_thread"></div>
                    <div class="disqus-overlay"><a class="show_all"><i class="icon-comment"></i>Hozzászólások megjelenítése [hvgcomments]</a></div>
                </div>
            </div>`);
    }

    function initDisqusJs() {
        var script = document.createElement('script');
        var l = location.protocol + "//" + location.host + location.pathname;
        script.textContent = `
            window.addEventListener('load', () => {
                var disqus_shortname = 'hvg';
                var disqus_identifier = '` + l + `';
                var disqus_title = '` + document.querySelector('meta[itemprop="name"]').content + `';
                var disqus_url = '` + l + `';
                var disqus_config = function () {
                    this.language = "hu";
                    this.page.api_key = 'tWtbL1OV8by298LctEFv9ccPxqJ7DUCg5sS064ItLBAWl11EdFJYcHqIgiZCVvS1';
                    this.page.remote_auth_s3 = '{}';
                };

                (function () {
                    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

                    // Comment számláláshoz async JS behívása
                    var dsqCommentCount = document.createElement('script'); dsqCommentCount.id = 'dsq-count-scr'; dsqCommentCount.type = 'text/javascript'; dsqCommentCount.async = true;
                    dsqCommentCount.src = '//' + disqus_shortname + '.disqus.com/count.js';
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsqCommentCount);
                })();
            });`;
        (document.head || document.documentElement).prepend(script);
    }

    var af = document.querySelector("div.article-main");
    if (null === af) {
        // only run on article pages
        log("no article found, doing nothing");
    } else {
        if (null !== document.getElementById("disqus_thread")) {
            log("comments enabled by hvg.hu, doing nothing");
        } else {
            log("comments disabled by hvg.hu, enabling...");
            init();
        }
    }
});
