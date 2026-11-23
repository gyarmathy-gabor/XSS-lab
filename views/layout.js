function page({ title = '', head = '', body = '', scripts = true }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${title ? `<title>${title}</title>\n    ` : ''}<link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/dark.css" rel="stylesheet">
${head}</head>
<body>
<div class="container" style="margin-top:20px;">
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            ${body}
        </div>
    </div>
</div>
${scripts ? `<script src="/js/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
` : ''}</body>
</html>`;
}

function nameForm(heading = "What's your name?") {
    return `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${heading}</h3>
                </div>
                <div class="panel-body">
                    <form method="GET">
                        <div><label>Name:</label></div>
                        <div><input class="form-control" name="name" ></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Enter"></div>
                    </form>
                </div>
            </div>`;
}

function commentForm(heading = 'Leave a comment') {
    return `<div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${heading}</h3>
                </div>
                <div class="panel-body">
                    <form method="GET">
                        <div><label>Comment:</label></div>
                        <div><input class="form-control" name="comment" ></div>
                        <div style="margin-top:7px"><input type="submit" class="btn btn-success pull-right" value="Enter"></div>
                    </form>
                </div>
            </div>`;
}

module.exports = { page, nameForm, commentForm };
