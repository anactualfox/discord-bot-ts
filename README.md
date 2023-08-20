# Discord TS Bot

Simple discord TS bot that has onMessageCreate commands, buttonInteractions commands and slash commands.

## Features

- Features an easy way to set up commands (Slash commands, listener events through onMessageCreate)
- Imgur API Calls (subreddit gallery images)
- Apex API Calls (current map, current item rotation)
- Faceit API Calls (Elo graph, Elo)

### Installation

---

-Set up config.json like this (out of date)

### config.json

```JSON
{
	"token": "your_token",
	"guildId": ["your_channel's_id", "another_channel's_id"],
	"clientId":"your_bot's_id",
	"APEX_API_KEY":"visit https://api.mozambiquehe.re/",
	"FACEIT_API_KEY":"visit https://developers.faceit.com/",
	"IMGUR_ID" : "visit https://apidocs.imgur.com/",
	"IMGUR_SECRET" : "visit https://apidocs.imgur.com/",
	"WelcomeChannel" : "your_welcome_channel's_id",
	"OWNERID" : "your_own_id"
}

```

### Final steps (required)

---

- Comment out everything commented `optional` in bot.ts and substitute your own code
- A simple example would be:
- Make a folder called eventCommands in root of project, and a file as "eventCommands.js".

```javascript
// This is just an example of how you could handle commands
class Events {
  static handleEvent = (msg, eventType) => {
    if (eventType == "messageCreate") Events.onMessageCreate(event);
    // etc
  };
  // Handling onMessageCreate events
  static onMessageCreate = (msg) => {
    // if-else chain for commands
    if (msg.content === "!<command>") {
      msg.reply(/*reply to caller*/);
    } else if (msg.content === "!<command2>") {
      msg.reply(/*reply to caller*/);
    }
    // message content parser
    else if (msg.content.toLowerCase().includes("<keyword to look through>")) {
      msg.reply(/*reply to caller*/);
    }
  };
  // Handling ButtonEvents
  static onInteractionCreateButton = (interaction, client) => {
    // example to fetch user
    const user = client.users.cache.get(interaction.user.id);
    // and DM text
    user.send(/*stuff*/);
    // or reply to interaction
    interaction.reply(/*stuff*/);
  };
}

module.exports = Events;
```

```bash
npm install
```

### Windows

```batch
::Delays for 15s to allow wifi to connect
timeout /T 15
cls
cd <path-to-bot>
npm start
```

### Bash (bot.sh)

```Bash
#!/usr/bin/bash
cd <path-to-bot>
npm start
```

### Running as a service on Linux (change what's inside angled brackets, remove angled brackets)

```
[Unit]
Description=<yourbotname> discord bot

[Service]
# delay service start until PC is connected to wifi/ethernet
# alternatively, use network-online.target
# ExecStartPre=/bin/sleep 15
User=<yourusername>
WorkingDirectory=<path/to/code>
Type=forking
ExecStart=<path/to/code>/bot.sh
Restart=always
RestartSec=15

[Install]
WantedBy=default.target
```
