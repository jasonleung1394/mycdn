$(document).ready(function () {
    console.log("DOM fully loaded and parsed");

    // Function to add vote buttons to the last bot message
    function addVoteButtons() {
        let lastBotMessage = null;
        let tmpContainer;

        $('.chat-message-markdown').each(function () {
            let parent = $(this).parent();
            let isBotMessage = parent.hasClass('chat-message-from-bot');

            // Update lastBotMessage if it's a bot message
            if (isBotMessage) {
                lastBotMessage = $(this);
                tmpContainer = parent;
            }
        });

        // Check if the last message is from the bot and doesn't already have vote buttons
        if (lastBotMessage && tmpContainer.hasClass('chat-message-from-bot') && lastBotMessage.find('.vote-buttons').length === 0) {
            // Create the vote buttons
            const upvoteButton = $('<button class="upvote"><span class="material-symbols-outlined">thumb_up</span></button>');
            const downvoteButton = $('<button class="downvote"><span class="material-symbols-outlined">thumb_down</span></button>');

            // Create a container for the buttons
            const buttonsContainer = $('<div class="vote-buttons"></div>');
            buttonsContainer.append(upvoteButton).append(downvoteButton);

            // Add the buttons container next to the last bot message
            tmpContainer.append(buttonsContainer);

            // Add click event listeners to the buttons
            upvoteButton.on('click', function () {
                logButtonClick('Upvote', lastBotMessage);
                buttonsContainer.hide();
            });

            downvoteButton.on('click', function () {
                logButtonClick('Downvote', lastBotMessage);
                buttonsContainer.hide();
            });
        }
    }

    // Function to log which button was clicked along with its message
    function logButtonClick(buttonType, messageElement) {
        let messageText = messageElement.find('p').text();
        console.log(`${buttonType} button clicked. Message: ${messageText}`);
    }

    // Variable to keep track of the last processed message
    let lastProcessedMessage = null;

    // Function to handle new .chat-message-markdown elements
    function handleNewMessages() {
        const messages = $('.chat-message-markdown');
        if (messages.length === 0) return;

        // Get the last message from the list
        const latestMessage = messages.last();
        if (latestMessage[0] === lastProcessedMessage) return;

        // Update the last processed message only if it's a bot message
        const parent = latestMessage.parent();
        if (parent.hasClass('chat-message-from-bot')) {
            lastProcessedMessage = latestMessage[0];
            addVoteButtons();
        }
    }

    // Select the target node using getElementsByClassName
    const targetNodes = document.getElementsByClassName('chat-messages-list');
    console.log(targetNodes); // Debugging: Check the target nodes

    if (targetNodes.length === 0) {
        console.error('Target node not found');
        return;
    }

    // Use the first element in the collection
    const targetNode = targetNodes[0];
    console.log(targetNode); // Debugging: Check the specific target node

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const $node = $(node);
                        // Check if the added node or its descendants have the class .chat-message-markdown
                        if ($node.hasClass('chat-message-markdown') || $node.find('.chat-message-markdown').length) {
                            handleNewMessages();
                        }
                    }
                });
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Initial call to handle existing messages
    handleNewMessages();
});
