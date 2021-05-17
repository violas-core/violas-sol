const switchs = require("./tokens_swith.js");

token_names = switchs.token_names();
for (let i = 0; i < token_names.length; i++) {
    switchs.create_token_script(token_names[i]);
}
