const express = require('express')
const http = require('http');
const host = 'localhost'
const port = 5000;
const requestListener = function(req, res) {req.writeHead(200); req.end("hi")}
const server = http.createServer(requestListener);
server.listen(port, host, () => {console.log(`server running on http://${host}:${port}`);});

const app = express()
app.listen(port, () => {
    console.log(`server started on port ${port}`)
})
const TelegramApi = require('node-telegram-bot-api')
const token = '7561960417:AAHidPdVo-fj6FpeAkLcNO0GdXs3Z88WJWg'
const bot = new TelegramApi(token, {polling: true})

const {gameOptions, againOptions, kmnOptions} = require('./modul')
const date = new Date();
const hour = date.getHours();
const chats = {}
const startGame = async (chatId) => {
        const randNum = Math.floor(Math.random() * 10)
        chats[chatId] = randNum;
        await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}
const kmn = async (chatId) => {
    await bot.sendMessage(chatId, `Надеюсь, что ты знаешь как играть. Выбирай!`, kmnOptions)
}
const start = () => {
    //commands
    bot.setMyCommands([
        {command: '/start', description: 'Здорова'},
        {command: '/info', description: 'Username(@), name and family'},
        {command: '/game', description: 'Угадай число'},
        {command: '/poldnik', description: 'Время полдника! Ном-ном'},
        {command: '/kmn', description: 'Камень, ножницы, бумага'},
    ])
    //command create 
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        let msgId = msg.message_id;
        let newTitle = msg.chat.title;
    //start
        if(text === '/start' || text === '/start@IlnurGoida_bot') {
           await bot.sendMessage(chatId, `Привет, ${msg.from.first_name}`);
           return console.log(msg);
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
            if(hour > 11 && hour < 13) {
                const randNumFunc = async (min, max) => {
                        const randNum = Math.floor(Math.random() * (max - min) + min);
                    if(randNum < 0){
                        return bot.sendMessage(chatId, `Не зачет, ${msg.from.first_name}! ${randNum} кг полдника!`)
                    }
                    else if(randNum == 0){
                        return bot.sendMessage(chatId, `Хм, нужно больше есть, +${msg.from.first_name}! ${randNum} кг полдника!`)
                    }
                    else if(randNum > 0){
                        return bot.sendMessage(chatId, `Зачет, ${msg.from.first_name}! +${randNum} кг полдника!`)
                    }
                    else if(randNum == max){
                        return bot.sendMessage(chatId, `Ну ты доешь, съел максимальную порцию, ${msg.from.first_name}! +${randNum} кг полдника!`)
                    }
                }
                randNumFunc(-5, 25)
            }
            else {
                return bot.sendMessage(chatId, `Не зачет! Полдникать можно только с 12:00 до 13:00!`)
            }
        }
    //камень ножницы бумага
    if(text === '/kmn' || text === '/kmn@IlnurGoida_bot') {
        await console.log(msg);
        return kmn(chatId);
    }
    
    //coords
    if(text === 'Coords'){
        const position = async () => {
            const pos = await new Promise((res, rej) => {
                navigator.geolocation.getCurrentPosition(res, rej)
            });
            return {
                geo: pos
            }  
        }
        await bot.sendMessage(chatId, position())    
    }
    if(text === 'd') {
        bot.sendMessage(chatId)
    }     
    //func end https://github.com/ilnurGoida777/PoldnikIlnurTgBot https://github.com/ilnurGoida777/PoldnikIlnurTgBot cmake -A x64 -DCMAKE_INSTALL_PREFIX:PATH=.. -DCMAKE_TOOLCHAIN_FILE:FILEPATH=../vcpkg/scripts/buildsystems/vcpkg.cmake ..
    })
    
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id; 
//again
    if(data === '/again') {
        return startGame(chatId)
    }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, @${msg.from.username}  ${msg.from.first_name}, ты отгадал цифру ${data}`, againOptions)
        }
        else if(data != chats[chatId] && data != 'paper' && data != 'stone' && data != 'nozh'){
            return bot.sendMessage(chatId, `@${msg.from.username} ${msg.from.first_name}, ты не отгадал цифру, была загаданна ${chats[chatId]}`, againOptions)
        }
        
    })
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const randKey = Math.floor(Math.random() * 3)
        const us = msg.from.username;
        const name = msg.from.first_name;
        
        if(data == 'paper' && randKey == 1) {
            bot.sendMessage(chatId, `Ты проиграл @${us} ${name}, я выбрал ножницы`)
        }
        else if(data == 'paper' && randKey == 0) {
            bot.sendMessage(chatId, `Ничья @${us} ${name}, я тоже выбрал бумагу`)
        }
        else if(data == 'paper' && randKey == 2) {
            bot.sendMessage(chatId, `Ты выиграл @${us} ${name}, я выбрал камень`)
        }
        //------
        else if(data == 'nozh' && randKey == 1) {
            bot.sendMessage(chatId, `Ты проиграл @${us} ${name}, я выбрал камень`)
        }
        else if(data == 'nozh' && randKey == 0) {
            bot.sendMessage(chatId, `Ничья @${us} ${name}, я тоже выбрал ножницы`)
        }
        else if(data == 'nozh' && randKey == 2) {
            bot.sendMessage(chatId, `Ты выиграл @${us} ${name}, я выбрал бумагу`)
        }
        //------
        else if(data == 'stone' && randKey == 0) {
            bot.sendMessage(chatId, `Ты проиграл @${us} ${name}, я выбрал бумагу`)
        }
        else if(data == 'stone' && randKey == 2) {
            bot.sendMessage(chatId, `Ничья @${us} ${name}, я тоже выбрал камень`)
        }
        else if(data == 'stone' && randKey == 1) {
            bot.sendMessage(chatId, `Ты выиграл @${us} ${name}, я выбрал ножницы`)
        }
    })
    //func end
}
start()
