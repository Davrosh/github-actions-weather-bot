require('dotenv').config()
const fetch = require('node-fetch')
const Telegram = require('node-telegram-bot-api')
const bot = new Telegram(process.env.TELEGRAM_TOKEN)
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

const main = async () => {
	const weatherData = await getWeatherData()
	const weatherString = generateWeatherMessage(weatherData)
	bot.sendMessage(process.env.TELEGRAM_CHAT_ID, weatherString)
}

main()
