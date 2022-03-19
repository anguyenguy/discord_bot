const fetch = require("node-fetch");
const config = require("./config.json");
const students = require("./database");


const {
    Client: Client,
    Intents: Intents,
    Collection: Collection,
    MessageEmbed: MessageEmbed,
  } = require('discord.js');

const client = new Client({
    messageCacheMaxSize: 200,
    intents: ["GUILDS","GUILD_MESSAGES", "GUILD_MEMBERS", "DIRECT_MESSAGES"],
    partials: ['USER', 'REACTION', 'MESSAGE', 'CHANNEL'],
  });

function getQuote(){
    return fetch("http://zenquotes.io/api/random")
    .then(res => {
        return res.json();
    })
    .then(data => {
        return data[0]["q"]+"-"+data[0]["a"]
    })
}

async function statuscheck() {
    const statusArray = {};
    await client.guilds.cache.forEach(async g => {
        const status = [];
        await g.members.cache.forEach(m => {
            status.push({
                status: m.user.presence.status,
                name: m.user.username
            });
        });
        statusArray[g.id] = status;
        console.log(status)
    });
    // console.log(statusArray);
    return statusArray;


}

async function getAllUserByRole(roleName){
    const guild = await client.guilds.fetch(config.myServerID); 
    const role = await guild.roles.cache.find(role => role.name === roleName); //the role to check
    const totalRole = role.members.map(m => m.id);
    // console.log('totalRole',totalRole);
    return totalRole;
}

client.on("message", msg => {

    // This event will trigger whenever a message is created in a channel 

    // Global:
    db.add(`globalMessages_${message.author.id}`, 1);
    // this add 1 to the ID

    

    // Guild:
    db.add(`guildMessages_${message.guild.id}_${message.author.id}`);
    // this add 1 to the ID 




    if(msg.content === "ping"){
        msg.reply(`Hello ${client.user.tag}`);
    }

    if(msg.content === "hi"){
        getQuote().then(quote => msg.channel.send(quote))
    }

    if(msg.content === ">dssinhvien") {
        // const list = client.guilds.cache.get(config.myServerID); 
        // list.members.cache.forEach(member => console.log(member.user.username)); 
        // console.log("MSG", msg);
        authorId = msg.author.id;
        getAllUserByRole('hannah').then(hannahRoles =>{
            if(hannahRoles.includes(authorId)){
                let channel = msg.guild.channels.cache.get('950768886381436979');
                // console.log('channel', channel);
                const exampleEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Danh sách sinh viên được hannah quản lý:')
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Rose bot', iconURL: 'https://www.funix.edu.vn/wp-content/uploads/2017/10/logo.png', url: 'https://funix.edu.vn' })
                .setThumbnail('https://www.funix.edu.vn/wp-content/uploads/2017/10/logo.png');
                students.forEach(student =>{
                    exampleEmbed.addField(student.name, 'id: '+student.id, true);
                })
                exampleEmbed
                .setImage('https://www.funix.edu.vn/wp-content/uploads/2017/10/logo.png')
                .setTimestamp()
                .setFooter({ text: 'Rose Bot posted', iconURL: 'https://www.funix.edu.vn/wp-content/uploads/2017/10/logo.png' });
                
                channel.send({ embeds: [exampleEmbed] });
            }
        })
    }
})



client.on("guildMemberAdd", member => {
    client.channels.get("947063449836458047").send(`Xin chào bạn ${member}! Hy vọng bạn sẽ vui khi gia nhập sân trường trên mây!`)
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
})

// client.on('ready', () => {
//     setInterval(() =>  statuscheck(client), 10000);
// }); // runs the check funtion evrey 10s to keep up to date);

client.login(config.BOT_TOKEN.replace('!',''));
