import s from './comet-server.mjs'
import g from './comet-groq.mjs'

const KEY = 'xxxx'

const server = s()

const groq = g(KEY)

server.front('front')

function timer() {
    const start = Date.now()
    return () => {
        const end = Date.now()
        const time = end - start
        const formattedtime = (time / 1000).toFixed(2)
        return formattedtime
    }
}

// can you help me write a js function that takes a string, and turns phrases surrounded by 2 *'s like this: "**Large user base**" and turns that text into "<strong>Large user base</strong>"?
server.api('/ask', async (data) => {
    //
    const getTime = timer()
    console.log('DATAA: ', data)
    const ress = await groq.llm({
        start: '<json>',
        end: '</json>',
        prompt: data.message,
        model: 'l3'
    })

    return {
        time: getTime(),
        response: ress.choices[0]?.message?.content || ''
    }
})

server.start()
