require('dotenv').config();
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const PREFIX = '-';
const HEADS = 'heads';
const TAILS = 'tails';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'flip') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('heads')
          .setLabel('Heads')
          .setStyle('PRIMARY')
          .setEmoji('1107926204461363220'),
        new MessageButton()
          .setCustomId('tails')
          .setLabel('Tails')
          .setStyle('PRIMARY')
          .setEmoji('1107926322447126558')
      );

    const embed = new MessageEmbed()
      .setTitle('What do you call? Predict the coin flip.')
      .setDescription('You can choose **"Heads"** or **"Tails"** and the **winner** of the coin flip will choose the sides.')
      .setColor(0x00FFFF)
      .setImage('https://i.ibb.co/9gjYkkz/Untitled-6-copy.png');

    message.reply({ embeds: [embed], components: [row] }).then((msg) => {
      const filter = (interaction) =>
        ['heads', 'tails'].includes(interaction.customId) && interaction.user.id === message.author.id;

      const collector = msg.createMessageComponentCollector({ filter, time: 15000, max: 1 });

      collector.on('end', (collected) => {
        if (collected.size === 0) {
          const timeoutEmbed = new MessageEmbed()
            .setTitle('Coinflip Request Timed Out')
            .setDescription('The coinflip request has timed out.');

          msg.edit({ embeds: [timeoutEmbed], components: [] });
          return;
        }

        const choice = collected.first().customId === 'heads' ? HEADS : TAILS;
        const flipResult = Math.random() < 0.5 ? HEADS : TAILS;
        const isWinner = choice === flipResult;

        const flippingCoinEmbed = new MessageEmbed()
          .setTitle('<a:Coinflip3:1107935580374958112> Flipping Coin')
          .setDescription('Please wait while the coin is flipping...')
          .setColor(0x00FFFF)
          .setImage('https://i.ibb.co/1Qx3Gsz/ezgif-com-gif-maker-1.gif');

        msg.edit({ embeds: [flippingCoinEmbed] }).then((flipMsg) => {
          setTimeout(() => {
            const resultEmbed = new MessageEmbed()
              .setTitle('<a:Coinflip3:1107935580374958112> Coinflip Result')
              .setDescription(
                `${message.author}, you called the option __*${choice}!*__\nThe result was __**${flipResult}**__ <:Frenzy:1096211348033114263>.\n${
                  isWinner ? '<:pepe_yes:1096211277984038962> You won! You can choose the sides now. Good Luck.' : '<:Sadge:1107941783905767434> You lost. You let your opponent choose the sides now. Good Luck.'
                }`
              )
              .setColor(0x00FFFF);

            flipMsg.edit({ embeds: [resultEmbed], components: [] });
          }, 3000); // Delay before showing the result (2 seconds in this example)
        });
      });
    });
  }
});

const PORT = process.env.PORT || ;


client.login(process.env.DISCORD_TOKEN);
