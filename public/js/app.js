const select = document.querySelector('.selectLang');
const run = document.querySelector('.run');
const stop = document.querySelector('.stop');
const reset = document.querySelector('.reset');
const textArea = document.querySelector('#textarea');
const output = document.querySelector('.output-content');
const wrapper = document.querySelector('#control-button-wrapper');


let languageSelected = 'null';
let id_out = -1;

select.addEventListener('change', event => {
    languageSelected = event.target.value;
});

run.addEventListener('click', async event => {

    event.preventDefault();

    if (Client_Secret_Key === 'null') { return; }

    run.disabled = true;

    const code = textArea.value;
    if (code === '') {
        writeToOutput('Text Area Empty !')
        return;
    } else if (languageSelected === 'null') {
        writeToOutput('Please select a language !')
        return;
    }

    // POST request using fetch()
    const resp = await fetch("https://api.hackerearth.com/v4/partner/code-evaluation/submissions/", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            lang: languageSelected,
            source: code,
            input: ""
        }),

        // Adding headers to the request
        headers: {
            "Content-type": "application/json",
            "client-secret": Client_Secret_Key
        }
    }).then(response => response.json())    // Converting to JSON

    clearOutput();

    writeToOutput(resp.request_status.message);
    writeToOutput(resp.result.compile_status);

    let first_time = true,
        REQUEST_QUEUED = 'REQUEST_QUEUED',
        CODE_COMPILED = 'CODE_COMPILED',
        REQUEST_COMPLETED = 'REQUEST_COMPLETED',
        REQUEST_FAILED = 'REQUEST_FAILED';

    id_out = setInterval(async () => {
        const response = await fetch(resp.status_update_url, {
            headers: { "client-secret": Client_Secret_Key }
        }).then(response => response.json());

        if (first_time) {
            stop.classList.remove("disappear");
            first_time = false;
        }

        console.log(response);

        if (response.request_status.code === REQUEST_QUEUED) {
            REQUEST_QUEUED = -1;
        }
        else if (response.request_status.code === CODE_COMPILED) {
            // writeToOutput(response.request_status.message);
            // CODE_COMPILED = -1;
            // do check for compilor msg != ''
            if (response.result.compile_status === "OK") {
                // MISSING
            }
            if (response.result.compile_status !== "Compiling...") {
                // do check 
                writeToOutput(response.result.compile_status);
                writeToOutput("\nCode Execution Stopped !");
                clearTimeout(id_out);
                stop.classList.add("disappear");
                return;
            }
        }
        else if (response.request_status.code === REQUEST_FAILED) {
            writeToOutput(response.request_status.message);
            REQUEST_FAILED = -1;
        }
        else if (response.request_status.code === REQUEST_COMPLETED) {
            writeToOutput(response.request_status.message);
            REQUEST_COMPLETED = -1;

            if (response.request_status.message === "Your request has been completed successfully") {
                clearTimeout(id_out);

                const resp_part3 = await fetch(response.result.run_status.output).then(res => res.text());
                writeToOutput("Output :\n");
                writeToOutput(resp_part3);
                stop.classList.add("disappear");

            }
        }


    }, 1000);

    /*
        var request = require('request');
    
        var program = {
            script: "",
            language: "php",
            versionIndex: "0",
            clientId: "YourClientID",
            clientSecret: "YourClientSecret"
        };
        request({
            url: 'https://api.jdoodle.com/v1/execute',
            method: "POST",
            json: program
        },
            function (error, response, body) {
                writeToOutput('error:', error);
                writeToOutput('statusCode:', response && response.statusCode);
                writeToOutput('body:', body);
            });
    */
})

stop.addEventListener('click', event => {
    event.preventDefault();
    stop.classList.add("disappear");
    if (id_out === -1) return;
    clearTimeout(id_out);
    id_out = -1;
    writeToOutput("\nCode Execution Stopped !");
})

reset.addEventListener('click', event => {
    event.preventDefault();
    textArea.value = '';
    clearOutput();
})

textArea.addEventListener('keydown', function (e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
            "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart =
            this.selectionEnd = start + 1;
    }
});



const writeToOutput = data => {

    const paragraph = document.createElement("p");

    // To add text to the <p> element, you must create a text node first. This code creates a text node:
    // const node = document.createTextNode(data);

    // Then you must append the text node to the <p> element:
    // paragraph.appendChild(node);

    paragraph.style.whiteSpace = 'pre-line';
    paragraph.innerHTML = data;

    // This code appends the new element to the existing element:
    output.appendChild(paragraph);
}

const clearOutput = () => {
    while (output.firstChild) {
        output.firstChild.remove()
    }
}

if (Client_Secret_Key === 'null') {
    run.classList.add('error-disabled');
    reset.classList.add('error-disabled');
    wrapper.classList.add('wrapper-disabled');
    writeToOutput('WARNING');
    writeToOutput('Client_Secret_Key is not defined');
    writeToOutput("Won't be able to run code");
}