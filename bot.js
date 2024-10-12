const TelegramApi = require('node-telegram-bot-api')

const token = '7561960417:AAHidPdVo-fj6FpeAkLcNO0GdXs3Z88WJWg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
        const randNum = Math.floor(Math.random() * 10)
        chats[chatId] = randNum;
        await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}
const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'играть снова', callback_data: '/again'}]
        ]
    })
}

const start = () => {
    //commands
    bot.setMyCommands([
        {command: '/start', description: 'Вход в хату'},
        {command: '/info', description: 'username(@), name and family'},
        {command: '/game', description: 'угадай число'}
    ])
    //command create 
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    //command called
    //start
        if(text === '/start') {
           await bot.sendMessage(chatId, `Вечер в хату!`);
        }
    //info
        if(text === '/info' && msg.chat.last_name !== undefined) {
            await console.log(msg)
            return bot.sendMessage(chatId, `username:  @${msg.chat.username}, name:  ${msg.chat.first_name}, family: ${msg.chat.last_name}`)
        }
        else if(text === '/info' && msg.chat.last_name === undefined){
            return bot.sendMessage(chatId, `username:  @${msg.chat.username}, nik:  ${msg.chat.first_name}`)
        }
    //game
        if(text === '/game') {
            return startGame(chatId);
        }
    
    })
    
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id; 
//again
    if(data === '/again') {
        return startGame(chatId)
    }

        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгодал цифру ${data}`, againOptions)
        }
        else if(data != chats[chatId]){
            return bot.sendMessage(chatId, `Ты не отгадал цифру, была загаданна ${chats[chatId]}`, againOptions)
        }
    })
    
    //func end
}

start()