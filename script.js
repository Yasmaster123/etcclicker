// Game variables
let readers = 0;
let readersPerSecond = 0;
let clickDelay = 3000; // 3 seconds delay for clicks
let canClick = true;

// Purchasable items
const purchasables = {
    paper: { cost: 10, rate: 1, owned: 0 },
};

// Upgrades
const upgrades = {
    anotherWriter: { cost: 50, rate: 5, owned: 0 },
    writingClasses: { cost: 100, cooldownReduction: 1000, owned: 0 }, // Writing classes reduce cooldown by 1 second each time
};

// HTML Elements
const readerCountElem = document.getElementById('reader-count');
const readerRateElem = document.getElementById('reader-rate');
const questElem = document.getElementById('quest');
const paperButton = document.getElementById('paper');
const anotherWriterButton = document.getElementById('another-writer');
const writingClassesButton = document.getElementById('writing-classes');
const clickButton = document.getElementById('click-button');

// Update the UI
function updateUI() {
    readerCountElem.textContent = `Readers: ${readers}`;
    readerRateElem.textContent = `Readers per Second: ${readersPerSecond}`;
    paperButton.textContent = `Paper (Cost: ${purchasables.paper.cost}, +${purchasables.paper.rate}/sec) [Owned: ${purchasables.paper.owned}]`;
    anotherWriterButton.textContent = `Another Writer (Cost: ${upgrades.anotherWriter.cost}, +${upgrades.anotherWriter.rate}/sec) [Owned: ${upgrades.anotherWriter.owned}]`;
    writingClassesButton.textContent = `Writing Classes (Cost: ${upgrades.writingClasses.cost}, Decrease cooldown by 1s) [Owned: ${upgrades.writingClasses.owned}]`;

    paperButton.disabled = readers < purchasables.paper.cost;
    anotherWriterButton.disabled = readers < upgrades.anotherWriter.cost;
    writingClassesButton.disabled = readers < upgrades.writingClasses.cost;

    clickButton.disabled = !canClick;

    // Check if quest is completed
    if (upgrades.anotherWriter.owned > 0) {
        questElem.textContent = "Quest Complete: Keep Growing Your Team!";
    }
}

// Handle purchases
function purchaseItem(item) {
    if (readers >= purchasables[item].cost) {
        readers -= purchasables[item].cost;
        purchasables[item].owned++;
        readersPerSecond += purchasables[item].rate;
        purchasables[item].cost = Math.ceil(purchasables[item].cost * 1.15); // Increase cost by 15%
        updateUI();
    }
}

function purchaseUpgrade(upgrade) {
    if (readers >= upgrades[upgrade].cost) {
        readers -= upgrades[upgrade].cost;
        upgrades[upgrade].owned++;
        if (upgrade === "writingClasses") {
            clickDelay -= upgrades.writingClasses.cooldownReduction; // Decrease the cooldown by 1 second
            if (clickDelay < 1000) { // Prevent cooldown from going below 1 second
                clickDelay = 1000;
            }
        }
        upgrades[upgrade].cost = Math.ceil(upgrades[upgrade].cost * 1.25); // Increase cost by 25%
        updateUI();
    }
}

// Clicking logic
clickButton.addEventListener('click', () => {
    if (canClick) {
        canClick = false;
        readers++;
        updateUI();
        setTimeout(() => {
            canClick = true;
            updateUI();
        }, clickDelay);
    }
});

paperButton.addEventListener('click', () => purchaseItem('paper'));
anotherWriterButton.addEventListener('click', () => purchaseUpgrade('anotherWriter'));
writingClassesButton.addEventListener('click', () => purchaseUpgrade('writingClasses'));

// Passive income generation
setInterval(() => {
    readers += readersPerSecond;
    updateUI();
}, 1000);

// Initialize UI
updateUI();
