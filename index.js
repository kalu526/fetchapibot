const Telegraf=require('telegraf');
const bot=new Telegraf("2085961351:AAEsIYJ3iWoft-fTN2Kvng_pdx7C2ECrNgo");
const axios =require('axios');
const fs=require('fs');


const helpmessage=
`
Simple Api Bot
/start- start the bot
/help-display the list of bot's command
/fortune- return a fortune Cookies
/cat- return a cats image
/cat <text>- return a cat image with the text
/dogbreeds- return a list of dog breeds
/dog -return a dog image
/dog <dogbreed>-return a specific dog breed image
`

bot.help((ctx)=>{
    ctx.reply(helpmessage);
})

bot.command("fortune",(ctx)=>{
    axios.get("http://yerkee.com/api/fortune")
    .then(res=>{
        ctx.reply(res.data.fortune);
    })
    .catch(e=>{
        console.log(e);
    })
})
bot.command("cat",async(ctx)=>{
    let input=ctx.message.text;
    let inputArray=input.split(" ");

    if(inputArray.length==1){
        try{
            let res=await axios.get("https://aws.random.cat/meow");
            ctx.replyWithPhoto(res.data.file);
            
        }
        catch(e){
            console.log(e);
        }
    }else{
        inputArray.shift();
        input=inputArray.join(" ");

        ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}`);
    }
})

bot.command("dogbreeds",(ctx)=>{
    let rawdata=fs.readFileSync("./dogbreeds.json","utf-8");
    let data=JSON.parse(rawdata);
 let message="DogBreeds:\n";
 data.forEach(item => {
     message+= `-${item}\n`
 });
 ctx.reply(message);
    
})

bot.command("dog",(ctx)=>{
    let input=ctx.message.text.split(" ");
    if(input.length !== 2){
        ctx.reply("You must write the dog breeds type");
        return;
    }
    
        let inputbreed=input[1];

        let rawdata=fs.readFileSync("./dogbreeds.json","utf-8");
    let data=JSON.parse(rawdata);

    if(data.includes(inputbreed)){
        axios.get(`https://dog.ceo/api/breed/${inputbreed}/images/random`)
        .then(res=>{
            ctx.reply(res.data);
        })
        .catch(e=>{
            console.log(e);
        })
    }
    else{
        let suggestion=data.filter(item=>{
            return item.startsWith(inputbreed);
        })
        let message="Did You Mean:\n"
        suggestion.forEach(item=>{
            message+=`-${item}\n`
        })
        ctx.reply(message);

        if(suggestion.length==0){
            ctx.reply("There is No Such Breed");
        }
    }


    
})

bot.launch();
