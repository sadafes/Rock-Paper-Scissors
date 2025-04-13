const openRulesBtn = document.querySelector(".open-rules");
const closeRulesBtn = document.querySelector(".close-rules");
const rulesOverlay = document.querySelector(".rules-overlay");
const resultButtonElement = document.querySelector(".result__button");

const playerWinsLSKey = "playerWins";
const HouseWinsLSKey = "HouseWins";

const winningResultMap = {
  paper: ["rock"],
  rock: ["scissors"],
  scissors: ["paper"],
};

let state = {
  playerWins: Number(localStorage.getItem(playerWinsLSKey)) || 0,
  HouseWins: Number(localStorage.getItem(HouseWinsLSKey)) || 0,
  playerPick: null,
  HousePick: null,
};

const renderScore = () => {
  const pointsElement = document.querySelector(".points");
  pointsElement.innerText = state.playerWins - state.HouseWins;
};

const bindPickEvents = () => {
  document.querySelectorAll(".options button").forEach((button) => {
    button.addEventListener("click", pick);
  });

  document.querySelector(".result__button").addEventListener("click", reset);
};

const pick = (e) => {
  pickByPlayer(e.currentTarget.dataset.pick);
  pickByHouse();
  hideOptions();
  fight();
  showFight();
};

const pickByPlayer = (pickedOption) => {
  state = {
    ...state,
    playerPick: pickedOption,
  
  };
};

const pickByHouse = () => {

  const options = ["rock", "paper", "scissors"];
  const filteredOptions = options.filter(option => option !== state.playerPick); 
  const HousePick = filteredOptions[Math.floor(Math.random() * filteredOptions.length)]; 
  state = {
    ...state,
    HousePick,
  };
};

const hideOptions = () => {
  document.querySelector('section').classList.add("action");
  document.querySelectorAll(".options button").forEach((button) => {
    button.classList.add("picked");
  if (button.dataset.pick === state.playerPick) {
    button.classList.add('anime'); 
} else {
    button.classList.add('hidden'); 
}
});
setTimeout(() => {
  document.querySelector(".options").classList.add("active");
  }, 1500);
}

const fight = () => {
  createElementPickedByPlayer();
  setTimeout(() => {
    createElementPickedByHouse();
  }, 1500);
  document.querySelectorAll(".options button").forEach((button) => {
    button.setAttribute("tabindex", -1);
  });
  document.querySelector(".result__button").setAttribute("tabindex", 0);

  showResult();
};

const showFight = () => {
  setTimeout(() => {
    const fightElement = document.querySelector(".fight");
    fightElement.classList.add("active");
}, 1500); 
}

const showResult = () => {
  const resultTextElement = document.querySelector(".result__text");

  if (winningResultMap[state.playerPick].includes(state.HousePick)) {
    resultTextElement.innerHTML = "YOU WIN";
    state = {
      ...state,
      playerWins: state.playerWins + 1,
    };
    localStorage.setItem(playerWinsLSKey, state.playerWins);
    setTimeout(() => highlightWinner("player"), 3800);
  } else {
    resultTextElement.innerHTML = "YOU LOSE";
    state = {
      ...state,
      HouseWins: state.HouseWins + 1,
    };
    localStorage.setItem(HouseWinsLSKey, state.HouseWins);

    resultButtonElement.classList.add("lost");
    setTimeout(() => highlightWinner("house"), 3800);
  }

  setTimeout(renderResult, 2200);

  setTimeout(renderScore, 5800);

};

const renderResult = () => {
  setTimeout(() => {
  document.querySelector(".result").classList.add("shown");
  document.querySelector(".pick-player").classList.add("moved");
  document.querySelector(".pick-house").classList.add("moved");
}, 4000);
};

const createElementSelectedByPlayer = () => {
  const playerPick = state.playerPick;

  const pickContainer = document.querySelector(
    ".button button-scissors"
  );

  pickContainer.innerHTML = "";
  pickContainer.appendChild(createPickElement(playerPick));
};
const createElementPickedByPlayer = () => {
  const playerPick = state.playerPick;

  const pickContainerElement = document.querySelector(
    ".pick__container-player"
  );

  pickContainerElement.innerHTML = "";
  pickContainerElement.appendChild(createPickElement(playerPick));
};

const createElementPickedByHouse = () => {
  const HousePick = state.HousePick;

  const pickContainerElement = document.querySelector(".pick__container-house");
  const houseTitleElement = document.getElementById("house-title");

  const fullText = "THE HOUSE IS PICKING";
  houseTitleElement.textContent = "";
  houseTitleElement.classList.add("typing");

  pickContainerElement.innerHTML = '<div class="loading-dots"></div>';

  let index = 0;
  const typingInterval = setInterval(() => {
    houseTitleElement.textContent += fullText[index];
    index++;

    if (index === fullText.length) {
      clearInterval(typingInterval);
      houseTitleElement.classList.remove("typing");
        
        setTimeout(() => {
          houseTitleElement.textContent = "THE HOUSE PICKED";
  
          setTimeout(() => {
            pickContainerElement.innerHTML = ""; 
            pickContainerElement.appendChild(createPickElement(HousePick));
          }, 500); 
        }, 1000);
    }
  }, 100); 
};

const createPickElement = (option) => {
  const pickElement = document.createElement("div");
  pickElement.classList.add(`button`, `button-${option}`);

  const imageContainerElement = document.createElement("div");
  imageContainerElement.classList.add("button__image-container");

  const imageElement = document.createElement("img");
  imageElement.src = `./images/icon-${option}.svg`;
  imageElement.alt = option;

  imageContainerElement.appendChild(imageElement);
  pickElement.appendChild(imageContainerElement);

  return pickElement;
};

const highlightWinner = (winner) => {
  setTimeout(() => {
    if (winner === "player") {
      document
        .querySelector(".pick__container-player .button")
        .classList.add("winner");
    } else if (winner === "house") {
      document
        .querySelector(".pick__container-house .button")
        .classList.add("winner");
    }
  }, 1500);
  
  }


const reset = () => {
  const fightElement = document.querySelector(".fight");
  fightElement.classList.remove("active");

  const optionsElement = document.querySelector(".options");
  optionsElement.classList.remove("active");
  document.querySelector("section").classList.remove("action");
  const buttonsEle = document.querySelectorAll('.button'); 

buttonsEle.forEach(button => {
    button.classList.remove("hidden"); 
    button.classList.remove("anime");
    button.classList.remove("picked");
});

  document.querySelectorAll(".options button").forEach((button) => {
    button.setAttribute("tabindex", 0);
  });
  document.querySelector(".result__button").setAttribute("tabindex", -1);

  resultButtonElement.classList.remove("lost");
  document.querySelectorAll(".button.winner").forEach((button) => {
    button.classList.remove("winner");
  });

  document.querySelector(".result").classList.remove("shown");
  document.querySelector(".pick-player").classList.remove("moved");
  document.querySelector(".pick-house").classList.remove("moved");
};

openRulesBtn.addEventListener("click", () => {
  rulesOverlay.classList.add("show");
});

closeRulesBtn.addEventListener("click", () => {
  rulesOverlay.classList.remove("show");
});
rulesOverlay.addEventListener("click", (event) => {
  if (event.target === rulesOverlay) {
    rulesOverlay.classList.remove("show");
  }
});
const init = () => {
  renderScore();
  bindPickEvents();
};

init();