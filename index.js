const fs = require('fs');
const t = require('markmap-lib/dist/transform');

var md = fs.readFileSync("./menu.md").toString();
var data = t.transform(md);

var nodes = [];
var edges = [];
var m = 0;

function processItem(i) {
    var node = {
        id: "m" + (m++),
        name: i.v,
        items: []
    };

    if (i.c) {
        var n = 0;
        for (const c of i.c) {
            //console.log(c);
            node.items.push(c.v);
            var submenu = processItem(c);
            if (submenu)
            {
                edges.push({
                    from: node.id + ":" + n,
                    to: submenu
                });
            }
            n++;
        }
    }

    if (node.items.length > 0)
    {
        nodes.push(node);
        return node.id;
    }
}

processItem(data, 0);

var result = "";

for (const i of nodes) 
{
    result += `"${i.id}" [ label = <<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="orange">\n`
    result += `<TR><TD PORT="p0" BGCOLOR="black" WIDTH="100"><FONT COLOR="orange">${i.name}</FONT></TD></TR>\n`
    for (let j = 0; j < i.items.length; j++) {
        const ii = i.items[j];
        result += `<TR><TD PORT="${j}">${i.items[j]}</TD></TR>\n`
    }
    result += `</TABLE>>];\n\n`;
}

result += `\n\n`;

for (const e of edges) 
{
    result += `${e.from} -> ${e.to}:p0\n`;
}

console.log(result);
