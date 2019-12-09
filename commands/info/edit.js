const fs = require("fs");
const { RichEmbed } = require("discord.js")

module.exports = {
  name: "edit",
  aliases:['ubah'],
  category: "info",
  run: async (client, msg, args) => {
    let users = JSON.parse(fs.readFileSync("./json/users.json", "utf8"));
    if(!users[msg.author.id]) users[msg.author.id] = {
      Nama: "-",
      Umur: "-",
      Asal: "-",
      Gender: "-",
      Deskripsi: "-"
    };
    let user = users[msg.author.id]
    let opsi = args[0]
    let list = ['nama', 'umur', 'asal', 'gender', 'deskripsi']
    if(!opsi || !list.includes(opsi)) {
      return msg.channel.send("edit: **nama, umur, asal, gender, deskripsi**")
    }
    if(opsi.match('nama')) {
      let nama = args.slice(1).join(" ");
      if(!nama) {
        return msg.channel.send('ketik Nama lu')
      }
      if(nama.length > 20) {
        return msg.channel.send('Maksimal 20 Kata')
      }
      if(nama === user.Nama) {
        return msg.channel.send('Itu Nama Yang lu pake skrg')
      }
      user.Nama = nama
      fs.writeFile("./json/users.json", JSON.stringify(users, null, 2), (err) => {
        if(err) console.warn(err)
      });
      let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Nama: **${nama}**\nKamu Bisa Cek [Disini](https://human62-web.glitch.me/user/${msg.author.id})
Nama Tidak Berbeda dari sebelumnya? coba refresh page`)
      await msg.channel.send(embed)
    }
    if(opsi.match('umur')) {
      let umur = args[1];
      if(!umur) {
        return msg.channel.send('ketik umur lu')
      }
      if(!Number(umur) || isNaN(umur)) {
        return msg.channel.send('Umur tu angka pekok')
      }
      if(umur === user.Umur) {
        return msg.channel.send('Itu umur lu skrg')
      }
      if(umur > 80) {
        return msg.channel.send('80+? tua amat')
      }
      user.Umur = `${umur} Tahun`
      fs.writeFile("./json/users.json", JSON.stringify(users, null, 2), (err) => {
        if(err) console.warn(err)
      });
      let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`umur: **${umur}**\nKamu Bisa Cek [Disini](https://human62-web.glitch.me/user/${msg.author.id})
umur Tidak Berbeda dari sebelumnya? coba refresh page`)
      await msg.channel.send(embed)
    }
    if(opsi.match('asal')) {
      let asal = args.slice(1).join(" ");
      if(!asal) {
        return msg.channel.send('ketik darimana asal lu')
      }
      if(asal.length > 100) {
        return msg.channel.send('Maksimal 100 kata')
      }
      user.Asal = asal
      fs.writeFile("./json/users.json", JSON.stringify(users, null, 2), (err) => {
        if(err) console.warn(err)
      });
      let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`asal: **${asal}**\nKamu Bisa Cek [Disini](https://human62-web.glitch.me/user/${msg.author.id})
asal Tidak Berbeda dari sebelumnya? coba refresh page`)
      await msg.channel.send(embed)
    }
    if(opsi.match('gender')) {
      let gender = args[1];
      if(!gender) {
        return msg.channel.send('ketik gender lu')
      }
      if(gender.toLowerCase() === "hode") {
        return msg.channel.send("g lucu pekok")
      }
      user.Gender = gender
      fs.writeFile("./json/users.json", JSON.stringify(users, null, 2), (err) => {
        if(err) console.warn(err)
      });
      let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`gender: **${gender}**\nKamu Bisa Cek [Disini](https://human62-web.glitch.me/user/${msg.author.id})
gender Tidak Berbeda dari sebelumnya? coba refresh page`)
      await msg.channel.send(embed)
    }
    if(opsi.match('deskripsi')) {
      let desk = args.slice(1).join(" ");
      if(!desk) {
        return msg.channel.send('ketik deskripsi apakee')
      }
      user.Deskripsi = desk
      fs.writeFile("./json/users.json", JSON.stringify(users, null, 2), (err) => {
        if(err) console.warn(err)
      });
      let embed = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`deskripsi: **${desk}**\nKamu Bisa Cek [Disini](https://human62-web.glitch.me/user/${msg.author.id})
deskripsi Tidak Berbeda dari sebelumnya? coba refresh page`)
      await msg.channel.send(embed)
    }
  }
}