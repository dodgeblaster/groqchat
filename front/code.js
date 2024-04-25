class Code extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        const content = this.innerHTML

        this.shadowRoot.innerHTML = /*html*/ `
        <style>
        * {
            box-sizing: border-box;
        }

        code,
        pre {
            background-color: #263238;
            color: white;
            font-weight: 400;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                'Liberation Mono', 'Courier New', monospace;
        }

        pre {
            padding: 20px;
            border-radius: 10px;
            font-size: 14px;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            margin: 0 auto;
            max-width: 800px;
            overflow-x: scroll;
            margin-bottom: 20px;
        }

        .comment-line {
            color: #546e7a;
            font-style: italic;
        }

        .keyword {
            color: #c792ea;
        }
        .function {
            color: #82aaff;
        }
        .special-functions {
            color: #ffcb6b;
        }
        .keyword-blue {
            color: #83d5f5;
        }
        .operator {
            color: #89ddff;
        }
        .number {
            color: #f78c6c;
        }
        .string {
            color: #c3e88d;
        }
        .boolean {
            color: #ff5370;
        }
        .null {
            color: #ff5370;
        }
        .undefined {
            color: #ff5370;
        }
        .regexp {
            color: #5c6bc0;
        }
        .comment {
            color: #676e95;
        }
        .punctuation {
            color: #83d5f5;
        }
        .identifier {
            color: #eeffff;
        }
        .template-literal {
            color: #c3e88d;
        }
        .builtin {
            color: #ffcb6b;
        }
        .reserved {
            color: #c792ea;
        }
        .html {
            color: #cb755b;
        }
        .css {
            color: #76d7c4;
        }
        .json {
            color: #c3e88d;
        }
        </style>
         <pre><code id="pre"></code></pre>
        `

        this.showCode(content)
    }

    showCode = (content) => {
        /**
         * COde
         */
        const jsTokenColors = new Map([
            ['keyword', '#C792EA'], // Syntax: Keyword
            ['operator', '#89DDFF'], // Syntax: Operator
            ['number', '#F78C6C'], // Syntax: Number
            ['string', '#C3E88D'], // Syntax: String
            ['boolean', '#FF5370'], // Syntax: Boolean
            ['null', '#FF5370'], // Syntax: Constant
            ['undefined', '#FF5370'], // Syntax: Constant
            ['regexp', '#5C6BC0'], // Syntax: RegExp
            ['comment', '#676E95'], // Syntax: Comment
            ['punctuation', '#EEFFFF'], // Syntax: Punctuation
            ['identifier', '#EEFFFF'], // Syntax: Variable
            ['template-literal', '#C3E88D'], // Syntax: Template Literal
            ['builtin', '#FFCB6B'], // Syntax: Built-in
            ['reserved', '#C792EA'], // Syntax: Reserved Word
            ['html', '#CB755B'], // Syntax: HTML/XML
            ['css', '#76D7C4'], // Syntax: CSS
            ['json', '#C3E88D'] // Syntax: JSON
        ])

        function parse(str) {
            return str
                .split('\n')
                .map((line) => {
                    if (line.startsWith('//')) {
                        return `<span class="comment-line" style="display: block; height: 24px;">${line}</span>`
                    }
                    let start =
                        '<span class="line" style="display: block; height: 24px;">'
                    let end = '</span>'

                    const parts = line.split('//')

                    if (parts.length === 1) {
                        return start + highlightCode(line) + end
                    } else {
                        const firstPart = parts[0]
                        const allOther = parts.slice(1).join('')
                        return (
                            start +
                            highlightCode(firstPart) +
                            `<span class='comment-line'>//${allOther}</span>` +
                            end
                        )
                    }
                })
                .join('')
        }

        function highlightCode(code) {
            // Define a regular expression to match non-word characters
            const wordAndNonWordRegex = /(\w+)|(\W)/g

            // Split the code string into an array of words and non-word characters

            const tokens = code.match(wordAndNonWordRegex)

            if (!tokens) return ''
            return tokens
                .map((token, index, arr) => {
                    if (/\W/.test(token)) {
                        // If the token is a non-word character, return it as is
                        return `<span class="punctuation">${token}</span>`
                    } else {
                        // Check if the token is a function name followed by an opening parenthesis
                        const isFunction =
                            arr[index + 1] === '(' ||
                            (arr[index + 1] && arr[index + 1].includes('('))

                        if (isFunction) {
                            const specialFunctions = ['Promise']

                            const isSpecialFunction =
                                specialFunctions.includes(token)
                            const css = isSpecialFunction
                                ? 'special-functions'
                                : 'function'

                            // If the token is a function name, treat it as a function token

                            return `<span class="${css}">${token}</span>`
                        } else {
                            // If the token is a word, identify its token type and wrap it in a span
                            const tokenType = getTokenType(token)
                            return `<span class="${tokenType}">${token}</span>`
                        }

                        // // If the token is a word, identify its token type and wrap it in a span
                        // const tokenType = getTokenType(token)
                        // return `<span class="${tokenType}">${token}</span>`
                    }
                })
                .join('')
        }

        function getTokenType(token) {
            // Define a list of JavaScript keywords
            const keywords = [
                'break',
                'case',
                'catch',
                'continue',
                'debugger',
                'default',
                'delete',
                'do',
                'else',
                'finally',
                'for',
                'function',
                'if',
                'in',
                'instanceof',
                'new',
                'return',
                'switch',
                'this',
                'throw',
                'try',
                'typeof',
                'var',
                'void',
                'while',
                'with',
                'const',
                'let',
                'async'
            ]

            const keywordsBlue = ['await', 'return', 'new', 'export', 'default']

            if (keywordsBlue.includes(token)) {
                return 'keyword-blue'
            }

            // Check if the token is a keyword
            if (keywords.includes(token)) {
                return 'keyword'
            }

            // Check if the token is a number
            if (!isNaN(token)) {
                return 'number'
            }

            if (token === 'false' || token === 'true') {
                return 'number'
            }

            // If the token is not a keyword or number, assume it's an identifier
            return 'identifier'
        }

        const highlightedCode = parse(content)

        //return highlightCode
        this.shadowRoot.getElementById('pre').innerHTML = highlightedCode
    }
}

customElements.define('polar-code', Code)
