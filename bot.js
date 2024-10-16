const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./modul')
const token = '7561960417:AAHidPdVo-fj6FpeAkLcNO0GdXs3Z88WJWg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
        const randNum = Math.floor(Math.random() * 10)
        chats[chatId] = randNum;
        await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}
app.listen(port, () => {
    console.log(`${port}`)
})
const start = () => {
    //commands
    bot.setMyCommands([
        {command: '/start', description: 'Вход в хату'},
        {command: '/info', description: 'Username(@), name and family'},
        {command: '/game', description: 'Угадай число'},
        {command: '/poldnik', description: 'Время полдника! Ном-ном'}
    ])
    //command create 
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    //command called
    //start
        if(text === '/start' || text === '/start@IlnurGoida_bot') {
           await bot.sendMessage(chatId, `Вечер в хату!`);
           //return console.log(msg);
        }
    //info
        if(text === '/info' && msg.from.last_name !== undefined) {
            //await console.log(msg)
            return bot.sendMessage(chatId, `username:  @${msg.from.username}, name:  ${msg.from.first_name}, family: ${msg.from.last_name}`)
        }
        else if(text === '/info@IlnurGoida_bot' && msg.from.last_name !== undefined) {
            return bot.sendMessage(chatId, `username:  @${msg.from.username}, name:  ${msg.from.first_name}, family: ${msg.from.last_name}`)
        }


        else if(text === '/info' || text === '/info@IlnurGoida_bot'  && msg.from.last_name === undefined){
            return bot.sendMessage(chatId, `username:  @${msg.from.username}, nik:  ${msg.from.first_name}`)
        }
        else if(text === '/info@IlnurGoida_bot'  && msg.from.last_name === undefined){
            return bot.sendMessage(chatId, `username:  @${msg.from.username}, nik:  ${msg.from.first_name}`)
        }
    //game
        if(text === '/game' || text === '/game@IlnurGoida_bot') {
            bot.sendMessage(chatId, `${msg.from.first_name}, сейчас я загадаю цифру от 0 до 9, попробуй её отгадать `)
            return startGame(chatId);
            //bot.deleteMessage(chatId, )
        }
    //полдник
        if(text === '/poldnik' || text === '/полдник' || text === '/poldnik@IlnurGoida_bot') {
            const rundMassaPoldnik = Math.floor(Math.random() * 25)
            return bot.sendMessage(chatId, `Зачет, ${msg.from.first_name}! + ${rundMassaPoldnik} кг полдника!`);
        }
    //func end
    })
    
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id; 
//again
    if(data === '/again') {
        return startGame(chatId)
    }

        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ${msg.from.first_name}, ты отгодал цифру ${data}`, againOptions)
        }
        else if(data != chats[chatId]){
            return bot.sendMessage(chatId, `${msg.from.first_name}, ты не отгадал цифру, была загаданна ${chats[chatId]}`, againOptions)
        }
         
    })
   
    //func end
}

start()