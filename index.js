const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("./config.json");

const client = new Discord.Client();

function getQuote(){
    return fetch("http://zenquotes.io/api/random")
    .then(res => {
        return res.json();
    })
    .then(data => {
        return data[0]["q"]+"-"+data[0]["a"]
    })
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on("message", msg => {
    if(msg.content === "ping"){
        msg.reply(`Hello ${client.user.tag}`);
    }

    if(msg.content === "hi"){
        getQuote().then(quote => msg.channel.send(quote))
    }
})

client.on("guildMemberAdd", member => {
    client.channels.get("947063449836458047").send(`Xin chào bạn ${member}! Hy vọng bạn sẽ vui khi gia nhập sân trường trên mây!`)
});

client.login(config.BOT_TOKEN.replace('!',''));
