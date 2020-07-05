require('dotenv').config()
const fetch = require('node-fetch')
const { Telegraf } = require('telegraf')
const Discord = require("discord.js")
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
const weatherToken = process.env.WEATHER_API_TOKEN
const weatherURL = new URL("https://api.openweathermap.org/data/2.5/weather")
weatherURL.searchParams.set('appid', process.env.WEATHER_API_TOKEN)
//weatherURL.searchParams.set('zip', "78747,us")
weatherURL.searchParams.set('units', "metric")
weatherURL.searchParams.set('id', "293690")

const getWeatherData = async () => {
	const resp = await fetch(weatherURL.toString())
	const body = await resp.json()
	return body
}

const generateWeatherMessage = weatherData => 
`The weather in ${weatherData.name}, ${weatherData.sys.country}: ${weatherData.weather[0].description}. The current temperature is ${weatherData.main.temp}, with ${weatherData.main.humidity}% humidity (temperture feels like ${weatherData.main.feels_like}). ` 


const client = new Discord.Client()
var weatherString = ""

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.guilds.cache.forEach((guild) => { 
         let defaultChannel = "";
         guild.channels.cache.forEach((channel) => {
               if(channel.type == "text" && defaultChannel == "") {
		             if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
		                 defaultChannel = channel;
		             }
               }
         })
         defaultChannel.send(weatherString) 
  })
})

const main = async () => {
	const weatherData = await getWeatherData()
	weatherString = generateWeatherMessage(weatherData)
	bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, weatherString)
	client.login(process.env.DISCORD_BOT_TOKEN)
	setTimeout(function(){ 
    client.destroy()
	}, 3000)
	

}


main()
