function convert_json_to_markdown(datas) {
    let deep = 0;
    let cache = {};
    let keys = [];
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i]
        for (let key in data) {
            if (keys.indexOf(key) < 0) keys.push(key);
            if( cache[key] == undefined) { cache[key] = new Map(); }

            cache[key][i] = data[key];
        }
    }

    let lines = new Array(datas.length + 2);
    lines[0] = keys.join("|");
    lines[1] = (new Array(keys.length)).join("---|")

    
    for (let i = 0; i < datas.length; i++) {
        let line = new Array(keys.length);
        for (let j in keys) {
            let key = keys[j];
            if (cache[key] != undefined && cache[key][i] != undefined) {
                line[j] = cache[key][i];
            }
        }
        lines[i + 2] = line.join("|");
    }
    
    return lines.join("\r\n");
}

module.exports = {
    convert_json_to_markdown,
}
