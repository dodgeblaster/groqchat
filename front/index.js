import '/chat.js'
import './code.js'

const ask = (x) =>
    fetch('api/ask', {
        method: 'POST',
        body: JSON.stringify(x)
    }).then((x) => x.json())

const c = document.getElementById('chat')
c.addEventListener('submit', async (e) => {
    c.setLoading()

    const res = await ask({ message: e.detail.value })

    const text = res.response.replaceAll('\n', '<br/>')

    let open = false
    const xx = text
        .split('**')
        .map((part) => {
            open = !open
            if (open) {
                return part + '<strong>'
            } else {
                return part + '</strong>'
            }
        })
        .join('')

    const xxx = xx
        .split('<br/>')
        .map((line) => {
            if (line.startsWith('* ')) {
                return `<span style="display: inline-block; margin-left: 10px;">${line.replace(
                    '* ',
                    '- '
                )}</span>`
            } else {
                return line
            }
        })
        .join('</br>')

    let codeOpen = false
    const xxxx = xxx
        .split('```')
        .map((part) => {
            part = part.replaceAll('<', '&lt').replaceAll('>', '&gt')
            codeOpen = !codeOpen
            if (codeOpen) {
                return part + '<zero-md><script type="text/markdown">'
            } else {
                return part + `</script></zero-md>`
            }
        })
        .join('')

    try {
        window.graph = JSON.parse(
            '{' +
                res.response
                    .replace('<layout>', '')
                    .replace('</layout>', '')
                    .split('{')
                    .slice(1)
                    .join('{')
        )
        window.renderGraph()
    } catch (e) {
        debugger
        //
    }

    c.setLoadingOff()
    c.addMessage('actor-ai', res.response)
})

/* 
You are a expert at organizing and laying out boxes. Here as an example of how you lay things out:

<json>
{ "def": [ "A(0,0) -> B(1,0)", "B(1,0) -> C(2,0)", "C(2,0) -> D(3,0)", "E(0,1) -> F(1,1)", "G(0,2) -> F(1,1)" ], "edges": [ "A -> B", "B -> C", "C -> D", "E -> F", "G -> F" ], "nodes": { "A": [0,0], "B": [1,0], "C": [2,0], "D": [3,0], "E": [0,1], "F": [1,1], "G": [0,2], "H": [0,3], "I": [1,3], "J": [2,3], "K": [1,2], "L": [2,2] } }
</json>

here is another example:

<json>
{ "def": [ "A(0,0) -> B(1,0)", "B(1,0) -> C(2,0)", "D(0,1) -> E(1,1)", "F(0,2) -> E(1,1)", "G(0,3) -> H(1,3)" ], "edges": [ "A -> B", "B -> C", "D -> E", "F -> E", "G -> H" ], "nodes": { "A": [0,0], "B": [1,0], "C": [2,0], "D": [0,1], "E": [1,1], "F": [0,2], "G": [0,3], "H": [1,3], "I": [2,1], "J": [2,2], "K": [3,1], "L": [3,2] } }
</json>

another example:

<json>
{ "def": [ "A(0,0) -> B(1,0)", "B(1,0) -> C(2,0)", "D(0,1) -> E(1,1)", "E(1,1) -> F(2,1)", "G(0,2) -> H(1,2)" ], "edges": [ "A -> B", "B -> C", "D -> E", "E -> F", "G -> H" ], "nodes": { "A": [0,0], "B": [1,0], "C": [2,0], "D": [0,1], "E": [1,1], "F": [2,1], "G": [0,2], "H": [1,2], "I": [0,3], "J": [1,3], "K": [2,3], "L": [3,3] } }
</json>

Each node has an x y position. Notice how if A is connected to B, then B is positioned to the right of A.
Every starting node in a relationship should be positioned to the left of the node that its connected to.

Only positive numbers are allowed for positions. No negative numbers are allowed.

I want you to create a layout for 12 nodes, and 5 edges between those nodes, and layout them out. Make
sure there are 1 to many relationships

Skip preamble. Return only JSON



LATEST::
You are a expert at organizing and laying out boxes. Here as an example of how you lay things out:

<json>
{ "def": [ "A(0,0) -> B(1,0)", "B(1,0) -> C(2,0)", "C(2,0) -> D(3,0)", "E(0,1) -> F(1,1)", "G(0,2) -> F(1,1)" ], "edges": [ "A -> B", "B -> C", "C -> D", "E -> F", "G -> F" ], "nodes": { "A": [0,0], "B": [1,0], "C": [2,0], "D": [3,0], "E": [0,1], "F": [1,1], "G": [0,2], "H": [0,3], "I": [1,3], "J": [2,3], "K": [1,2], "L": [2,2] } }
</json>

here is another example:

<json>
{ "def": [ "A(0,0) -> B(1,0)", "B(1,0) -> C(2,0)", "D(0,1) -> E(1,1)", "F(0,2) -> E(1,1)", "G(0,3) -> H(1,3)" ], "edges": [ "A -> B", "B -> C", "D -> E", "F -> E", "G -> H" ], "nodes": { "A": [0,0], "B": [1,0], "C": [2,0], "D": [0,1], "E": [1,1], "F": [0,2], "G": [0,3], "H": [1,3], "I": [2,1], "J": [2,2], "K": [3,1], "L": [3,2] } }
</json>

another example:

<json>
{ "def": [ "A(0,0) -> B(1,0)", "B(1,0) -> C(2,0)", "D(0,1) -> E(1,1)", "E(1,1) -> F(2,1)", "G(0,2) -> H(1,2)" ], "edges": [ "A -> B", "B -> C", "D -> E", "E -> F", "G -> H" ], "nodes": { "A": [0,0], "B": [1,0], "C": [2,0], "D": [0,1], "E": [1,1], "F": [2,1], "G": [0,2], "H": [1,2], "I": [0,3], "J": [1,3], "K": [2,3], "L": [3,3] } }
</json>

Each node has an x y position. Notice how if A is connected to B, then B is positioned to the right of A.
Every starting node in a relationship should be positioned to the left of the node that its connected to.

Only positive numbers are allowed for positions. No negative numbers are allowed.

I want you to create a layout for 12 nodes, and 5 edges between those nodes, and layout them out. Make
sure there are 1 to many relationships

Skip preamble. Return only JSON
*/
