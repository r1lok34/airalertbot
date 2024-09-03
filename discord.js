const {
  createAudioResource,
  createAudioPlayer,
  entersState,
  joinVoiceChannel,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const path = require("path");
const token = process.env.DISCORD_TOKEN;

exports.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

exports.connectToChannel = async (channel, sounds, trevoga) => {
  const channelInstanse = await exports.client.channels.fetch(
    channel.channelId
  );

  const connection = joinVoiceChannel({
    channelId: channel.channelId,
    guildId: channel.guildId,
    adapterCreator: channelInstanse.guild.voiceAdapterCreator,
  });

  let filePath;

  if (trevoga) {
    filePath = path.join(__dirname, sounds.trevoga[channel.trevogaSoundId]);
  } else {
    filePath = path.join(__dirname, sounds.otboi[channel.otboiSoundId]);
  }

  const resource = createAudioResource(filePath);

  const player = createAudioPlayer();
  connection.subscribe(player);

  player.play(resource);

  player.on(AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });
};

exports.client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

exports.client.login(token);
