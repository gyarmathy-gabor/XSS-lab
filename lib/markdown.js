function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderInline(text, filterJs) {
    const IMAGE = /!\[([^\]]*)\]\((.+)\)/;
    const LINK = /\[([^\]]*)\]\((.+)\)/;
    const BOLD = /\*\*(.+?)\*\*/;
    const ITALIC = /\*(.+?)\*/;

    let out = '';
    let rest = text;

    while (rest.length) {
        const img = rest.match(IMAGE);
        const lnk = rest.match(LINK);
        const bold = rest.match(BOLD);
        const ital = rest.match(ITALIC);

        const candidates = [img, lnk, bold, ital].filter(Boolean);
        if (!candidates.length) {
            out += escapeHtml(rest);
            break;
        }
        candidates.sort((a, b) => a.index - b.index);
        const m = candidates[0];

        out += escapeHtml(rest.slice(0, m.index));

        if (m === img) {
            const alt = escapeHtml(m[1]);
            let url = m[2];
            if (filterJs) url = url.replace(/javascript/gi, '');
            out += `<img src="${url}" alt="${alt}">`;
        } else if (m === lnk) {
            const label = escapeHtml(m[1]);
            let url = m[2];
            if (filterJs) url = url.replace(/javascript/gi, '');
            out += `<a href="${url}">${label}</a>`;
        } else if (m === bold) {
            out += `<strong>${escapeHtml(m[1])}</strong>`;
        } else if (m === ital) {
            out += `<em>${escapeHtml(m[1])}</em>`;
        }

        rest = rest.slice(m.index + m[0].length);
    }

    return out;
}

function renderMarkdown(input, { filterJs = false } = {}) {
    const paragraphs = input.split(/\n\n+/);
    return paragraphs
        .map((p) => `<p>${renderInline(p, filterJs)}</p>`)
        .join('\n');
}

module.exports = { renderMarkdown };
