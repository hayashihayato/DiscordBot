// Response for Uptime Robot
const http = require("http");
http
  .createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Discord bot is active now \n");
  })
  .listen(3000);

//Discord bot implements
const discord = require("discord.js");
const client = new discord.Client();
const roles = ["Planner", "Designer", "Programmer"];
const ytdl = require("ytdl-core");
const ytpl = require('ytpl');
const ytsr = require('ytsr');
const urlArray = new Array();
const titleArray = new Array();
let isLoop = false;
let dispatcher;

client.on("ready", async message => {
  console.log("bot is ready!");
});

client.on("message", message => {
  const { guild } = message;
  if (message.author.bot) return;
  Inputcmd(message, guild);
});

function Inputcmd(msg, gld) {
  let cmd = "";
  if (!msg.content.startsWith("+") & !msg.content.startsWith("-") & !msg.content.startsWith(":")) return;
  if (msg.content.startsWith("+") || msg.content.startsWith("-"))
    cmd = msg.content.substr(0, 1);
  else cmd = msg.content.split(' ')[0];
  switch (cmd) {
    case ":help":
    case ":h":
      Help(msg);
      break;
    case ":roles":
    case ":r":
      Roles(msg);
      break;
    case ":join":
    case ":j":
      Join(msg);
      break;
    case ":disconnected":
    case ":dc":
      Disconnected(msg);
      break;
    case ":musiclist":
    case ":ml":
      MusicList(msg);
      break;
    case ":nowplay":
    case ":np":
      NowPlayng(msg);
      break;
    case ":skip":
    case ":fs":
      Skip(msg);
      break;
    case ":loop":
    case ":l":
      Loop(msg);
      break;
    case ":play":
    case ":p":
      Play(msg);
      break;
    case "+":
      AddRole(msg, gld);
      break;
    case "-":
      RemoveRole(msg, gld);
      break;
    case ":dice":
      DiceRoll(msg);
      break;
    default:
      msg.reply("Commands Not Found");
      break;
  }
}

function AddRole(msg, gld) {
  if (!msg.author.bot) {
    let rolename = msg.content.substr(1);
    const role = gld.roles.cache.find(role => role.name === rolename);
    if (role != null) {
      msg.member.roles.add(role);
      msg.reply('Add"' + rolename + '"Role!');
    } else {
      msg.reply("Roles Not Found");
    }
    msg.delete();
  }
}

function RemoveRole(msg, gld) {
  if (!msg.author.bot) {
    let rolename = msg.content.substr(1);
    const role = gld.roles.cache.find(role => role.name === rolename);
    if (role != null) {
      msg.member.roles.remove(role);
      msg.reply('Remove"' + rolename + '"Role!');
    } else {
      msg.reply("Roles Not Found");
    }
    msg.delete();
  }
}

function Help(msg) {
  const helpEmbed = new discord.MessageEmbed()
    .setTitle("Commands List")
    .addFields(
      { name: ":help(:h)", value: "コマンド一覧表示" },
      { name: ":roles(:r)", value: "役職名一覧" },
      { name: ":join(:j)", value: "ボイスチャンネルに接続" },
      { name: ":play [URL or 検索したい文字列](:p)", value: "URL or 検索結果一番目の動画を再生" },
      { name: ":skip(:fs)", value: "再生中の音楽をスキップ" },
      { name: ":loop(:l)", value: "音楽のループ切り替え" },
      { name: ":list(:ml)", value: "予約されている音楽の一覧" },
      { name: ":nowplay(:np)", value: "再生中の音楽の情報" },
      { name: ":disconnected(:dc)", value: "ボイスチャンネルから切断" },
      { name: ":dice [最大値]", value: "指定した最大値までのサイコロを振ります" },
      { name: "+[rolename]", value: "役職付与" },
      { name: "-[rolename]", value: "役職剝奪" }
    );
  msg.channel.send(helpEmbed);
}

const DiceRoll = (msg) => { return msg.channel.send(`:game_die:${Math.floor(Math.random() * Number(msg.content.split(" ")[1])) + 1}`) }

function Roles(msg) {
  let cont = "";
  roles.map(role => {
    cont += "- " + role + "\n";
  });
  msg.channel.send({
    embed: {
      title: "Role List",
      description: cont
    }
  });
}

function Join(msg) {
  if (!msg.guild.voiceConnection && msg.member.voice.channel) {
    msg.member.voice.channel.join();
  } else if (msg.guild.voiceConnection) {
    msg.reply("既に接続済みです");
  } else {
    msg.reply("ユーザーがボイスチャンネルに接続していません");
  }
}

function Disconnected(msg) {
  /*if (!msg.guild.me.voiceConnection) {
    msg.reply("ボイスチャンネルに接続していません");
  } else {*/
  urlArray.length = 0;
  titleArray.length = 0;
  isLoop = false;
  if (dispatcher != null) dispatcher.end();
  msg.guild.me.voice.channel.leave();
}

function MusicList(msg) {
  let cont = "";
  for (let i = 0; i < urlArray.length; i++) {
    cont += `${i + 1}：${titleArray[i]}\n`;
    console.log(`${i + 1} ${titleArray[i]}\n`);
  }
  console.log(cont);
  msg.channel.send({
    embed: {
      title: "Music List",
      description: cont
    }
  });
}

function NowPlayng(msg) {
  msg.channel.send({
    embed: {
      title: "Now Playng Music",
      description: titleArray[0]
    }
  });
}

function Skip(msg) {
  if (dispatcher == null) return msg.reply("何も再生されていません");
  if (isLoop) {
    urlArray.shift();
    titleArray.shift();
  }
  dispatcher.end();
}

function Loop(msg) {
  if (isLoop) {
    isLoop = false;
    msg.channel.send("ループが無効になりました")
  }
  else {
    isLoop = true;
    msg.channel.send("ループが有効になりました")
  }
}

async function Play(msg) {
  let url = msg.content.split(" ")[1];
  if (!msg.member.voice.channel) return msg.reply("ユーザーがボイスチャンネルに接続していません");
  if (url.startsWith("https://www.youtube.com/") || url.startsWith("https://youtube.com/") || url.startsWith("https://youtu.be/")) {
    if (ytdl.validateURL(url)) {
      let isundefined = false;
      const info = await ytdl.getBasicInfo(ytdl.getURLVideoID(url)).then((info) => {
        return info.videoDetails;
      }).catch((err) => {
        isundefined = true;
        console.log(err);
        msg.reply("再生できない動画です");
      })

      if (isundefined) return;
      urlArray.push(url);
      titleArray.push(info.title);
      if (urlArray.length > 1) return;
      return PlayMusic(msg, urlArray[0]);
    }
    else if (ytpl.validateID(url)) {
      const plResult = await ytpl.getPlaylistID(url).then(async (res) => {
        return await ytpl(res);
      }).catch((err) => {
        console.log(err)
      })

      let i = 0;
      while (true) {
        urlArray.push(plResult.items[i].url);
        titleArray.push(plResult.items[i].title);
        if (plResult.items[i + 1] != null) i++;
        else break;
      }
      if (urlArray.length > 1) return;
      return PlayMusic(msg, urlArray[0]);
    }
    else return msg.reply("存在しないURLです");
  }
  else {
    let isPlay = true;
    if (urlArray.length > 1) isPlay = false;
    const srResult = await ytsr(url);
    msg.channel.send(srResult.items[0].url);
    urlArray.push(srResult.items[0].url);
    titleArray.push(srResult.items[0].title);
    if (urlArray.length > 1) return;
    return await PlayMusic(msg, urlArray[0]);
  }
}

async function PlayMusic(msg, url) {
  if (!msg.guild.voiceConnection) msg.member.voice.channel.join();
  const conn = await msg.member.voice.channel.join()
  const stream = ytdl(ytdl.getURLVideoID(url), { filter: "audioonly" });
  dispatcher = conn.play(stream);
  console.log("PlayMusic!");
  dispatcher.on('finish', () => {
    console.log("OneMoreMusic!");
    if (isLoop) return PlayMusic(msg, urlArray[0]);
    urlArray.shift();
    titleArray.shift();
    if (urlArray.length > 0) PlayMusic(msg, urlArray[0]);
    else Disconnected(msg);
  })
    .catch((err) => {
      console.log(err)
    })
}

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);