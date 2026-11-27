const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { page, nameForm, commentForm } = require('./views/layout');
const { renderMarkdown } = require('./lib/markdown');

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, UPLOAD_DIR),
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    })
});

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/', (req, res) => {
    res.send(page({
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">XSS Menu</h3>
                </div>
                <div class="panel-body">
                    <h3>Basic XSS</h3>
                    <ul>
                        <li><a href="/basic" target="_blank">Basic</a></li>
                    </ul>
                    <h3>Escaping Context</h3>
                    <ul>
                        <li><a href="/context-input" target="_blank">Escaping Context: input</a></li>
                        <li><a href="/context-textarea" target="_blank">Escaping Context: textarea</a></li>
                        <li><a href="/context-title" target="_blank">Escaping Context: title</a></li>
                        <li><a href="/context-style" target="_blank">Escaping Context: style</a></li>
                        <li><a href="/exercise-1" target="_blank">Exercise 1</a></li>
                    </ul>
                    <h3>Filter Evasion</h3>
                    <ul>
                        <li><a href="/filter-script-case" target="_blank">Filter: Script Tags case sensitivity</a></li>
                        <li><a href="/filter-script-2nd" target="_blank">Filter: Script Tags second occurrence</a></li>
                        <li><a href="/filter-script" target="_blank">Filter: Script Tags</a></li>
                        <li><a href="/filter-on-attr" target="_blank">Filter: Tag On Attributes</a></li>
                        <li><a href="/filter-tags" target="_blank">Filter: All Tags</a></li>
                        <li><a href="/filter-swear-tags" target="_blank">Filter: Swear Words and Tags</a></li>
                    </ul>
                    <h3>Content Type</h3>
                    <ul>
                        <li><a href="/content-type" target="_blank">Perform XSS inside JSON</a></li>
                    </ul>
                    <h3>Markdown</h3>
                    <ul>
                        <li><a href="/markdown" target="_blank">Markdown basic XSS</a></li>
                        <li><a href="/markdown-filter" target="_blank">Markdown "javascript" string filter</a></li>
                    </ul>
                    <h3>Stored</h3>
                    <ul>
                        <li><a href="/stored" target="_blank">Stored XSS</a></li>
                        <li><a href="/upload" target="_blank">Image Upload Stored XSS</a></li>
                        <li><a href="/profile" target="_blank">Profile Edit Stored XSS</a></li>
                        <li><a href="/profile2" target="_blank">Profile Edit Stored XSS 2</a></li>
                    </ul>
                    <h3>CSP (Content Security Policy)</h3>
                    <ul>
                        <li><a href="/csp-wildcard" target="_blank">Wildcard</a></li>
                        <li><a href="/csp-data" target="_blank">Data:</a></li>
                        <li><a href="/csp-jsonp" target="_blank">3rd Party Domains JSONP</a></li>
                    </ul>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">If you're done...</h3>
                </div>
                <div class="panel-body">
                    <ul>
                        <li><a href="https://xss-game.appspot.com/" target="_blank">XSS Game</a></li>
                        <li><a href="https://alf.nu/alert1" target="_blank">alert(1) to win</a></li>
                        <li><a href="https://tryhackme.com/room/axss" target="_blank">TryHackMe: Advanced XSS</a></li>
                        <li><a href="https://tryhackme.com/room/thestickershop" target="_blank">TryHackMe: The Sticker Shop</a></li>
                    </ul>
                </div>
            </div>`
    }));
});

app.get('/basic', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        return res.send(page({ body: nameForm() }));
    }
    res.send(page({
        body: `<div class="alert alert-success">
                    <p class="text-center">Hello, ${name}</p>
                </div>`
    }));
});

app.get('/context-input', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        return res.send(page({ body: nameForm() }));
    }
    res.send(page({
        body: `<div class="alert alert-success">
                    <p class="text-center">Hello, <input value="${name}"></p>
                </div>`
    }));
});

app.get('/context-textarea', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        return res.send(page({ body: nameForm() }));
    }
    res.send(page({
        body: `<div class="alert alert-success">
                    <p class="text-center">Hello, <textarea>${name}</textarea></p>
                </div>`
    }));
});

app.get('/context-title', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        return res.send(page({ body: nameForm() }));
    }
    res.send(page({
        title: `Welcome, ${name}`,
        body: `<div class="alert alert-success">
                    <p class="text-center">Thanks for entering your name</p>
                </div>`
    }));
});

app.get('/context-style', (req, res) => {
    const color = req.query.color !== undefined ? req.query.color : '#FFFFFF';
    res.send(page({
        title: 'Your Style!',
        head: `    <style>
        body {
            background-color: ${color};
        }
    </style>
`,
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Change the background color of the website!</h3>
                </div>
                <div class="panel-body">
                    <form method="get">
                        <div><label>Background Color:</label></div>
                        <div><input class="form-control" name="color" placeholder="#FFFFFF" value="#FFFFFF"></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Enter"></div>
                    </form>
                </div>
            </div>`
    }));
});

app.get('/exercise-1', (req, res) => {
    const { name } = req.query;
    if (name === undefined) {
        return res.send(page({ body: nameForm() }));
    }
    res.send(page({
        body: `<div class="alert alert-success">
                    <p class="text-center"><img src="${name}" width="100"></p>
                </div>`
    }));
});

function filterPanel(req, res, filterFn) {
    const { comment } = req.query;
    if (comment === undefined) {
        return res.send(page({ body: commentForm('Leave a comment') }));
    }
    const filtered = filterFn(comment);
    res.send(page({
        body: `<div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Your Comment</h3>
                    </div>
                    <div class="panel-body">
                        ${filtered}
                    </div>
                </div>`
    }));
}

app.get('/filter-script-case', (req, res) => {
    filterPanel(req, res, (c) => c.replace(/<script>/g, '').replace(/<\/script>/g, ''));
});

app.get('/filter-script-2nd', (req, res) => {
    filterPanel(req, res, (c) => c.replace(/<script[^>]*>[\s\S]*?<\/script>/i, ''));
});

app.get('/filter-script', (req, res) => {
    filterPanel(req, res, (c) => c.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ''));
});

app.get('/filter-on-attr', (req, res) => {
    filterPanel(req, res, (c) => c.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, ''));
});

app.get('/filter-tags', (req, res) => {
    filterPanel(req, res, (c) => c.replace(/<\/?[a-zA-Z][^<>]*>/g, ''));
});

const SWEAR_WORDS = ['fuck', 'shit', 'bitch', 'asshole'];
app.get('/filter-swear-tags', (req, res) => {
    filterPanel(req, res, (c) => {
        const hasSwear = new RegExp(SWEAR_WORDS.join('|'), 'i').test(c);
        if (hasSwear) {
            return c.replace(new RegExp(SWEAR_WORDS.join('|'), 'gi'), '');
        }
        if (/<\/?[^>]*>/.test(c)) {
            return '';
        }
        return c;
    });
});

app.get('/content-type', (req, res) => {
    res.send(page({
        body: `<div class="alert alert-info text-center">
                <p>Check whether a username is available on social media</p>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Username check</h3>
                </div>
                <div class="panel-body">
                    <div><label>Username:</label></div>
                    <div><input class="form-control" name="username"></div>
                    <div style="margin-top:7px"><input type="button" class="btn btn-success pull-right check" value="Check"></div>
                </div>
            </div>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        $('.check').click( function(){
            $.getJSON('/content-type/check.php?username=' + $('input[name="username"]').val(), function(resp){
                alert( resp.msg );
            });
        });
    });
</script>`
    }));
});

app.get('/content-type/check.php', (req, res) => {
    const username = req.query.username || '';
    res.set('Content-Type', 'text/html; charset=UTF-8');
    res.send(`{"msg":"Username '${username}' is available!"}`);
});

function markdownPage(title, resultHeading, resultHtml) {
    return page({
        body: `<h1 class="text-center">MarkDown 2 HTML Generator</h1>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${resultHeading}</h3>
                </div>
                <div class="panel-body">
                    ${resultHtml}
                </div>
            </div>
            <a href="${title}" class="btn btn-danger">Back</a>`
    });
}

function markdownForm() {
    return page({
        body: `<h1 class="text-center">MarkDown 2 HTML Generator</h1>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Enter your markdown to test</h3>
                </div>
                <div class="panel-body">
                    <form method="get">
                        <div><label>Markdown:</label></div>
                        <div><textarea class="form-control" name="name"></textarea></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Enter"></div>
                    </form>
                </div>
            </div>`
    });
}

app.get('/markdown', (req, res) => {
    const { name } = req.query;
    if (name === undefined) return res.send(markdownForm());
    res.send(markdownPage('/markdown', 'HTML Result', renderMarkdown(name, { filterJs: false })));
});

app.get('/markdown-filter', (req, res) => {
    const { name } = req.query;
    if (name === undefined) return res.send(markdownForm());
    res.send(markdownPage('/markdown-filter', 'HTML Result', renderMarkdown(name, { filterJs: true })));
});

app.get('/stored', (req, res) => {
    res.send(page({
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Latest Post</h3>
                </div>

            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Please leave a another comment about our post!</h3>
                </div>
                <div class="panel-body">
                    <form id="commentForm">
                        <div><label>Comment:</label></div>
                        <div><textarea class="form-control" name="comment" id="commentInput"></textarea></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Enter"></div>
                    </form>
                </div>
            </div>

            <div id="comments"></div>
        </div>
<script>
(function () {
    var KEY = 'xss-lab-stored-comments';

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function timestamp() {
        var d = new Date();
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
            ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function save(comments) {
        localStorage.setItem(KEY, JSON.stringify(comments));
    }

    function render() {
        var comments = load();
        var html = '';
        comments.forEach(function (c) {
            html += '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                '<h3 class="panel-title">Comment Left At: ' + c.time + '</h3>' +
                '</div>' +
                '<div class="panel-body">' +
                c.text +
                '</div>' +
                '</div>';
        });
        document.getElementById('comments').innerHTML = html;
    }

    if (!localStorage.getItem(KEY)) {
        save([
            { text: 'asd', time: timestamp() },
            { text: 'asd', time: timestamp() },
            { text: 'asd', time: timestamp() },
            { text: 'hgsdfhsdg', time: timestamp() }
        ]);
    }

    document.getElementById('commentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var text = document.getElementById('commentInput').value;
        var comments = load();
        comments.push({ text: text, time: timestamp() });
        save(comments);
        document.getElementById('commentInput').value = '';
        render();
    });

    render();
})();
</script>`
    }));
});

function uploadPage() {
    const files = fs.readdirSync(UPLOAD_DIR).filter((f) => f !== '.gitkeep');
    const list = files.length
        ? `<ul>${files.map((f) => `<li><a href="/uploads/${f}" target="_blank">${f}</a></li>`).join('')}</ul>`
        : '<p>No images uploaded yet.</p>';
    return page({
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Upload a profile picture</h3>
                </div>
                <div class="panel-body">
                    <p>Only png, jpg and webp images are allowed.</p>
                    <form method="post" action="/upload" enctype="multipart/form-data">
                        <div><input type="file" name="image" accept="image/png,image/jpeg,image/webp"></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Upload"></div>
                    </form>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Uploaded Images</h3>
                </div>
                <div class="panel-body">
                    ${list}
                </div>
            </div>`
    });
}

app.get('/upload', (req, res) => {
    res.send(uploadPage());
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.redirect('/upload');
});

app.get('/profile', (req, res) => {
    res.send(page({
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Edit Profile</h3>
                </div>
                <div class="panel-body">
                    <form id="profileForm">
                        <div><label>Name:</label></div>
                        <div><input class="form-control" name="name" id="profileName"></div>
                        <div><label>Website:</label></div>
                        <div><input class="form-control" name="website" id="profileWebsite"></div>
                        <div><label>Description:</label></div>
                        <div><textarea class="form-control" name="description" id="profileDescription"></textarea></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Save Profile"></div>
                    </form>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Profile Preview</h3>
                </div>
                <div class="panel-body" id="profileView"></div>
            </div>
<script>
(function () {
    var KEY = 'xss-lab-profile';

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || { name: '', website: '', description: '' };
        } catch (e) {
            return { name: '', website: '', description: '' };
        }
    }

    function save(profile) {
        localStorage.setItem(KEY, JSON.stringify(profile));
    }

    function render() {
        var profile = load();
        var view = document.getElementById('profileView');
        view.innerHTML = '';

        var name = document.createElement('h4');
        name.textContent = profile.name;
        view.appendChild(name);

        var link = document.createElement('a');
        link.setAttribute('href', profile.website);
        link.textContent = 'Visit website';
        view.appendChild(link);

        var desc = document.createElement('p');
        desc.textContent = profile.description;
        view.appendChild(desc);

        document.getElementById('profileName').value = profile.name;
        document.getElementById('profileWebsite').value = profile.website;
        document.getElementById('profileDescription').value = profile.description;
    }

    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        save({
            name: document.getElementById('profileName').value,
            website: document.getElementById('profileWebsite').value,
            description: document.getElementById('profileDescription').value
        });
        render();
    });

    render();
})();
</script>`
    }));
});

app.get('/profile2', (req, res) => {
    res.send(page({
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Edit Profile</h3>
                </div>
                <div class="panel-body">
                    <form id="profileForm">
                        <div><label>Name:</label></div>
                        <div><input class="form-control" name="name" id="profileName"></div>
                        <div><label>Website:</label></div>
                        <div><input class="form-control" name="website" id="profileWebsite"></div>
                        <div><label>Description:</label></div>
                        <div><textarea class="form-control" name="description" id="profileDescription"></textarea></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Save Profile"></div>
                    </form>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">Profile Preview</h3>
                </div>
                <div class="panel-body" id="profileView"></div>
            </div>
<script>
(function () {
    var KEY = 'xss-lab-profile-2';

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || { name: '', website: '', description: '' };
        } catch (e) {
            return { name: '', website: '', description: '' };
        }
    }

    function save(profile) {
        localStorage.setItem(KEY, JSON.stringify(profile));
    }

    function sanitizeUrl(url) {
        if (/^\\s*javascript:/i.test(url)) {
            return '#';
        }
        return url;
    }

    function render() {
        var profile = load();
        var view = document.getElementById('profileView');
        view.innerHTML = '';

        var name = document.createElement('h4');
        name.textContent = profile.name;
        view.appendChild(name);

        var label = document.createElement('div');
        label.textContent = 'Website Preview:';
        view.appendChild(label);

        var preview = document.createElement('iframe');
        preview.style.width = '100%';
        preview.style.height = '150px';
        preview.style.border = '1px solid #444';
        preview.src = sanitizeUrl(profile.website);
        view.appendChild(preview);

        var desc = document.createElement('p');
        desc.textContent = profile.description;
        view.appendChild(desc);

        document.getElementById('profileName').value = profile.name;
        document.getElementById('profileWebsite').value = profile.website;
        document.getElementById('profileDescription').value = profile.description;
    }

    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        save({
            name: document.getElementById('profileName').value,
            website: document.getElementById('profileWebsite').value,
            description: document.getElementById('profileDescription').value
        });
        render();
    });

    render();
})();
</script>`
    }));
});

function cspPage(name) {
    return page({
        scripts: false,
        body: `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">What's your name?</h3>
                </div>
                <div class="panel-body">
                    <form method="GET">
                        <div><label>Name:</label></div>
                        <div><input class="form-control" name="name" ></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Enter"></div>
                    </form>
                    ${name !== undefined ? `<p class="text-center" style="margin-top:15px">Hello, ${name}</p>` : ''}
                </div>
            </div>`
    });
}

app.get('/csp-wildcard', (req, res) => {
    res.set('Content-Security-Policy', `script-src 'self' http://localhost:${PORT} *`);
    res.send(cspPage(req.query.name));
});

app.get('/csp-data', (req, res) => {
    res.set('Content-Security-Policy', `script-src 'self' http://localhost:${PORT} data:`);
    res.send(cspPage(req.query.name));
});

app.get('/csp-jsonp', (req, res) => {
    res.set('Content-Security-Policy', "script-src 'self' https://www.google.com https://www.youtube.com");
    res.send(cspPage(req.query.name));
});

app.listen(PORT, () => {
    console.log(`XSS lab listening on http://localhost:${PORT}`);
});
