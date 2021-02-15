// Load up the discord.js library
const Discord = require("discord.js");

/*
 DISCORD.JS VERSION 12 CODE
*/

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`c!help [Serving ${client.guilds.cache.size} server(s)]`);
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`c!help [Serving ${client.guilds.cache.size} server(s)]`);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`c!help [Serving ${client.guilds.cache.size} server(s)]`);
});


client.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
    if(!message.content.startsWith(config.prefix)) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Let's go with a few common example commands! Feel free to delete or change those.

    if(command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        message.delete({ timeout: 3000 });
    }

    if(command === "help") {
        // inside a command, event listener, etc.
        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setURL('https://discord.com/oauth2/authorize?client_id=763393420374048810&scope=bot&permissions=8')
            .setAuthor('Fellow Crewmate Commands', 'https://i.imgur.com/7iIoKtJ.png')
            // .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/7iIoKtJ.png')
            .addFields(
                { name: '`c!help`', value: 'display this message' },
                { name: '`c!mute` [`c!m`]', value: 'mute everyone in the current voice channel' },
                { name: '`c!unmute` [`c!u`]', value: 'unmute everyone who is not dead in the current voice channel' },
                { name: '`c!f_unmute` [`c!fu`]', value: 'unmute everyone in the current voice channel' },
                { name: '`c!ping`', value: 'check bot ping' },
                { name: 'For bug reports/improvements/downtime write', value: '[here](https://t.me/incend1ary)' },
            )
            .setTitle('Invite to your server')
            // .addField('Inline field title', 'Some value here', true)
            // .setImage('https://i.imgur.com/wSTFkRM.png')
            // .setTimestamp()
            // .setFooter('[For bug reports/improvements/downtime messages]()');
        message.author.send(exampleEmbed);
        message.delete({ timeout: 3000 });
    }

    if(command === "mute" || command === "m") {
        if(!message.member.roles.cache.some(r=>["Crewmate Mod"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!").then(msg => {
                msg.delete({timeout : 3000 })
            });;

        if (message.member.voice.channel) {
            let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
            for (const [memberID, member] of channel.members) {
                // I added the following if statement to mute everyone but the invoker:
                // if (member != message.member)

                // This single line however, nested inside the for loop, should mute everyone in the channel:
                member.voice.setMute(true);
            }
        } else {
            message.reply('You need to join a voice channel first!').then(msg => {
                msg.delete({timeout : 10000 })
            });
        }
        message.delete({ timeout: 3000 });
    }

    if(command === "unmute" || command === "u") {
        if(!message.member.roles.cache.some(r=>["Crewmate Mod"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!").then(msg => {
                msg.delete({timeout : 3000 })
            });;

        if (message.member.voice.channel) {
            let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
            for (const [memberID, member] of channel.members) {
                // I added the following if statement to mute everyone but the invoker:
                // if (member != message.member)

                // This single line however, nested inside the for loop, should mute everyone in the channel:
                if (!member.roles.cache.some(role => role.name === 'Dead')) {
                    member.voice.setMute(false);
                }
            }
        } else {
            message.reply('You need to join a voice channel first!').then(msg => {
                msg.delete({timeout : 10000 })
            });
        }
        message.delete({ timeout: 3000 });
    }

    if(command === "f_unmute" || command === "fu") {
        if(!message.member.roles.cache.some(r=>["Crewmate Mod"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!").then(msg => {
                msg.delete({timeout : 3000 })
            });;

        if (message.member.voice.channel) {
            let channel = message.guild.channels.cache.get(message.member.voice.channel.id);
            for (const [memberID, member] of channel.members) {
                // I added the following if statement to mute everyone but the invoker:
                // if (member != message.member)

                // This single line however, nested inside the for loop, should mute everyone in the channel:
                member.voice.setMute(false);
            }
        } else {
            message.reply('You need to join a voice channel first!').then(msg => {
                msg.delete({timeout : 10000 })
            });
        }
        message.delete({ timeout: 3000 });
    }
});

client.login(config.token);