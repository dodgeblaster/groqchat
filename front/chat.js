class MyChat extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        this.shadowRoot.innerHTML = /* html*/ `
        <style>
            .container {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            code, pre {
                background: #444;
                color: white !important;
                padding: 20px;
                border-radius: 10px;
                font-size: 14px !important;
            }

            code {
                width: 100%;
            }

            .chat-window {
                display: flex;
                flex-direction: column;
                /* background: green; */
                flex: 1;
                margin-bottom: 10px;
                justify-content: flex-end;
                overflow-y: scroll;
            }

            .chat-window-scroll {
                overflow-y: scroll;
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }

            .chat-window-scroll::-webkit-scrollbar {
                display: none;
            }

            .chat-input{
                display: flex;
                /* background: red; */
                flex: 0 0 60px;
                padding: 10px;
               
            }

            .chat-input input {
                border: none;
                border-radius: 10px;
                /* background: #eaebef; */
                border: 1px solid #eaebef;
                width: 100%;
                padding: 10px 30px;
                outline: none;
                box-shadow: 0 8px 30px rgb(0,0,0,0.12);
            }

            .chat-name {
                font-size: 14px;
                margin: 0;
                font-weight: bold;
                opacity: 0.9;
                display: flex;
                align-items: center;
                /* margin-bottom: 5px; */
            }

            .message {
                background: #232429;
                padding: 15px 15px;
                border-radius: 5px;
                margin: 10px;
                font-size: 14px;
                line-height: 1.6;
            }

            .actor-ai {
                margin-right: 40px;
                background-color: #6d68f3;
                color: white;

                color: #1d1d30;
    background: white;
    padding: 0;
                
            }

            .actor-me {
                margin-left: 40px;
                background-color: #eaebef;
                color: #221c49;
            }

               /* loading */
            .typing-indicator {
               
                background-color: #E6E7ED;
                will-change: transform;
                height: 26px;
                width: 40px;
                border-radius: 2px 13px 13px 13px;
                // padding: 20px;
                display: flex;
                flex-flow: row nowrap;
                margin-left: 54px;
                position: relative;
                animation: 2s bulge infinite ease-out;
                justify-content: center;
                align-items: center;
            }
            .typing-indicator    span {
                    height: 6px;
                    width: 6px;
                    margin: 0 1px;
                    background-color: #9E9EA1;
                    display: block;
                    border-radius: 50%;
                    opacity: 0.4;

            }
                   
                .typing-indicator    span:nth-of-type(1) {
                       animation: 1s blink infinite .3333s;
                }
                  .typing-indicator    span:nth-of-type(2) {
                       animation: 1s blink infinite .6666s;
                }
                  .typing-indicator    span:nth-of-type(3) {
                       animation: 1s blink infinite .9999s;
                }

                @keyframes blink {
                50% {
                    opacity: 1;
                }
                }

                @keyframes bulge {
                50% {
                    transform: scale(1.05);
                }}

                /* CODE STYLES */

                .task-container {
                  padding:0px;
                  overflow: hidden;
                
                
                  margin: 0px;
                  color: black;
                  border: 1ps solid #eee;
                  


                }
                .task-container-inner {
                 
                 
                }
        </style>
        <div class='container'>
            <div class='chat-window'>
            
            <div class='chat-window-scroll' id='chat-window-scroll'></div>
            </div>
            <div class='chat-input'>
                <input id='chat' placeholder='Chat...'/>
                <div style='position: absolute; bottom: 20px; right: 20px;
                height: 40px;
                width: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #bed1f6;'>${this.upArrow}</div>
            </div>
        </div>
        `
    }

    upArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`

    connectedCallback() {
        this.shadowRoot
            .getElementById('chat')
            .addEventListener('keydown', (e) => {
                //

                if (e.key === 'Enter') {
                    const myEvent = new CustomEvent('submit', {
                        bubbles: true,
                        cancelable: true,
                        composed: false,
                        detail: {
                            value: this.shadowRoot.getElementById('chat').value
                        }
                    })

                    this.addMessage(
                        'actor-me',
                        this.shadowRoot.getElementById('chat').value
                    )

                    this.dispatchEvent(myEvent)

                    this.shadowRoot.getElementById('chat').value = ''
                }
            })

        this.shadowRoot.getElementById('chat').focus()
    }

    setLoading() {
        const div = document.createElement('div')
        div.setAttribute('id', 'loading')
        div.style.width = '100%'

        div.innerHTML = `<div class='typing-indicator'><span></span>
  <span></span>
  <span></span></div>`
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(div)

        this.shadowRoot.getElementById('chat').value = ''
    }

    setLoadingOff() {
        const div = this.shadowRoot.getElementById('loading')
        if (div) {
            div.remove()
        }
    }

    addMessage(actor, text) {
        const msg = document.createElement('div')

        const aiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style='height: 14px; margin-right: 4px;'>
            <path d="M16.5 7.5h-9v9h9v-9z" />
            <path fill-rule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clip-rule="evenodd" />
        </svg>`

        const meSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style='height: 14px; margin-right: 4px;'>
            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
        </svg>`

        msg.innerHTML = `<p class='chat-name'>
            ${actor === 'actor-ai' ? aiSvg : meSvg}
            ${actor === 'actor-ai' ? 'Groq AI' : 'You'}</p>
        <p style='margin: 0'>
        
  <zero-md>

        <template>

        <style>
p {
    margin: 0;
      
}
code[class*="language-"],
pre[class*="language-"] {
	color: #f8f8f2;
	background: none;
	font-family: "Fira Code", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
	text-align: left;
	white-space: pre;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
	line-height: 1.5;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
	-webkit-hyphens: none;
	-moz-hyphens: none;
	-ms-hyphens: none;
	hyphens: none;
            font-size: 14px;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
}

/* Code blocks */
pre[class*="language-"] {
	padding: 1em;
	margin: .5em 0;
	overflow: auto;
	border-radius: 0.3em;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
	background: #2E3440;
    background: #111b2e;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
	padding: .1em;
	border-radius: .3em;
	white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
	color: #636f88;
}

.token.punctuation {
	color: #81A1C1;
}

.namespace {
	opacity: .7;
}

.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
	color: #81A1C1;
}

.token.number {
	color: #B48EAD;
}

.token.boolean {
	color: #81A1C1;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
	color: #A3BE8C;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string,
.token.variable {
	color: #81A1C1;
}

.token.atrule,
.token.attr-value,
.token.function,
.token.class-name {
	color: #88C0D0;
}

.token.keyword {
	color: #81A1C1;
}

.token.regex,
.token.important {
	color: #EBCB8B;
}

.token.important,
.token.bold {
	font-weight: bold;
}

.token.italic {
	font-style: italic;
}

.token.entity {
	cursor: help;
}
        </style>
        
        
        </template>
    
                            <script type="text/markdown">${text}
                            </script>
                        </zero-md>
        
        </p>`
        msg.classList.add('message')
        msg.classList.add(actor)
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(msg)

        const t = document.createElement('p')
        t.innerHTML = formatTime()
        t.style.fontSize = '12px'
        t.style.opacity = '0.3'
        t.style.marginLeft = actor === 'actor-ai' ? '10px' : '40px'
        t.style.marginTop = '-5px'
        this.shadowRoot.querySelector('.chat-window-scroll').appendChild(t)

        const chatWindow = this.shadowRoot.querySelector('.chat-window-scroll')
        chatWindow.scrollTop = chatWindow.scrollHeight - chatWindow.clientHeight
    }
}

/**
 * Function that takes Date.now() and turns it into format 7.23pm
 */
function formatTime() {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const hours12 = hours % 12 || 12
    const minutes12 = minutes < 10 ? `0${minutes}` : minutes
    return `${hours12}:${minutes12}${ampm}`
}

customElements.define('my-chat', MyChat)
