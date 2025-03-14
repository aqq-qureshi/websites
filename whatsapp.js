const apiKey = '$2a$10$n5L06qsK.wDHOEs8K9GDQO.CramolJ88HPjwIX3T5wi7j/JYZfjU2';
const binId = '67d48b258561e97a50ec1098';
const jsonbinUrl = `https://api.jsonbin.io/v3/b/67d48b258561e97a50ec1098`;

$(document).ready(async function () {

    $('#myInput').val('');
    $('#name').val('');

    var currentChatNo = 0;

    var allMessages = [

    ];

    await loadMessagesFromJsonBin(allMessages);

    const inputArea = $('#allMessages');
    const namearea = $('#name');
    // Function to handle sending text
    function sendText() {
        var text = inputArea.val().trim();
        var name = namearea.val().trim();
        if (!name) {
            alert("Name is required");
            return;
        }
        if (text + name) {
            var currentTime = new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            var newMessage = {
                chatnumber: currentChatNo,
                text: text,
                from: name,
                time: currentTime
            };

            inputArea.val('');
            addMessage(newMessage);

            allMessages.push(newMessage)

            saveMessageJsonBin().then(function () {
                if (allMessages.length > 100) {
                    //allMessages.splice(0, allMessages.length - 100);
                    $('.chatbox .message:first').remove();
                }
                console.log("Current number of messages in the array: " + allMessages.length);

                showMessagesForChat(currentChatNo, allMessages);
            }).catch(function(e) {
                console.log(e);
            });
        }
    }

    function addMessage(message) {
        var newMessageDiv = $('<div class="message my_message"><p>Hi<br><span>12:15</span></p></div>');
        newMessageDiv.find('p').html(message.from + ": " + message.text + " " + message.time);
        newMessageDiv.find('span').html(message.time);
        $('.chatbox').append(newMessageDiv);

    }

    //Event listener for the Send button
    $('#sendButton').click(sendText);

    //Event listener for the Send button
    $('.chatname').click(chatClick);

    $('#tryit').click(myFunction);


    function chatClick() {
        var div = $(this);
        var chatno = div.attr("chatnumber");
        currentChatNo = parseInt(chatno);
        if (currentChatNo === 1) {
            $('#child').show('slow');
        }
        else {
            $(".chatname.active").removeClass('active');
            div.addClass('active');

            showMessagesForChat(currentChatNo, allMessages);
        };

        if (currentChatNo === 0) {
            $('#child').hide('fast')
        }
    };

    // Event listener for pressing Enter key in the textarea
    inputArea.keypress(function (e) {
        if (e.which === 13) { // 13 is the Enter key
            e.preventDefault(); // Prevent default action (new line or form submission)
            sendText();

        };
    });

    async function saveMessageJsonBin() {
        await storeMessages(allMessages);

    };

    function showMessagesForChat(chatNumber, allMessages) {
        $(".chatbox").empty();
        console.log("clear messages" + allMessages.length);

        allMessages.forEach(m => {
            if (m.chatnumber == chatNumber) {
                addMessage(m);
            };
        });

    };

    async function loadMessagesFromJsonBin(allMessages) {
        allMessages.splice(0, allMessages.length);
        console.log("a" + allMessages.length);
        await loadMessages(allMessages, function () {
            showMessagesForChat(currentChatNo, allMessages);
        });
        //document.getElementById("output").innerText = JSON.stringify(messages);

    };

    //var running = false;
    //setInterval(function () {
        //if (running) return;
        //running = true;
        //loadMessagesFromJsonBin(allMessages).then(function () {
            //running = false;
        //});
    //}, 60000);

    async function storeMessages(messages) {


        try {

            let req = new XMLHttpRequest();

            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    console.log(req.responseText);
                }
            };

            req.open("PUT", jsonbinUrl, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Access-Key", apiKey);

            const json = JSON.stringify(messages);

            req.send(json);

        } catch (error) {
            console.error("Error:", error);
        };
    };

    async function loadMessages(messages, finished) {
        try {
            let req = new XMLHttpRequest();

            req.onreadystatechange = () => {
                if (req.readyState == XMLHttpRequest.DONE) {
                    const json = JSON.parse(req.responseText); // eval(req.responseText);
                    const record = json.record;
                    messages.splice(0,messages.length);

                    record.forEach(y => messages.push(y));

                    finished();
                };
            };

            req.open("GET", jsonbinUrl, true);
            req.setRequestHeader("x-coding-key", apiKey);
            req.send();

        } catch (error) {
            console.error("Error:", error);
        };
    };

    function myFunction() {
        var letter = document.getElementById("myInput").value;
        var website;
        // If the letter is "c"
        if (letter === "apple") {
            showMessagesForChat(currentChatNo, allMessages);
            $('#child').hide();

            // If the letter is anything else
        } else {
            text = "Wrong Password! &#128551";
            showMessagesForChat(0, allMessages);
        };
        $("#demo").html(text);
    };
});
