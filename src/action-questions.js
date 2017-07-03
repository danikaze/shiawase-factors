(() => {
  const BUTTON_ID = 'shiawase-hint';
  let xml;

  const buttonStyle = {
    position: 'absolute',
    'z-index': '99999',
    background: 'rgb(249, 255, 203)',
    width: '93px',
    height: '27px',
    top: '64px',
    left: '727px',
    border: '1px solid rgb(1, 12, 49)',
    'border-radius': '5px',
    'text-align': 'center',
    cursor: 'pointer',
    'font-weight': 'bold',
    'font-size': 'smaller',
    color: '#1d228c',
  };
  const buttonContentStyle = {
    position: 'relative',
    top: '4px',
  };

  function shiawaseSetData(data, options) {
    if (injectHintButton()) {
      xml = JSON.parse(data);
    }
  }

  function checkAnswers(answer) {
    for (let i = 0; ; i++) {
      let ans = document.getElementById(`choice-text${i}`);
      if (!ans) {
        ans = document.getElementById(`imgchoice${i}`);
        if (!ans) {
          return;
        }
      }
      if (ans.classList.contains('checked-color') ^ answer.indexOf(i) !== -1) {
        ans.click();
      }
    }
  }

  function getAnswers(qElem) {
    const questions = xml.assessment.questions.question;
    const text = qElem.innerHTML;
    const question = questions.filter((elem) => text.indexOf(elem._question) === 0);

    if (!question.length) {
      return [];
    }

    return question[0]._correct.split(',').map((elem) => parseInt(elem, 10) - 1);
  }

  function hint() {
    const qElem = document.getElementById('question');

    if (!qElem) {
      return;
    }

    const answers = getAnswers(qElem);
    checkAnswers(answers);
  }

  function applyStyle(elem, style) {
    if (!elem) {
      return;
    }

    Object.keys(style).forEach((key, i) => {
      elem.style[key] = style[key];
    });
  }

  function injectHintButton() {
    const parent = document.getElementById('btnArea');
    if (!parent) {
      return false;
    }

    if (document.getElementById(BUTTON_ID)) {
      return false;
    }
    const button = document.createElement('div');

    button.id = BUTTON_ID;
    button.innerHTML = '<span>Hint</span>';
    applyStyle(button, buttonStyle);
    applyStyle(button.children[0], buttonContentStyle);

    button.addEventListener('click', hint);
    parent.appendChild(button);

    return true;
  }

  window.shiawaseSetData = shiawaseSetData;
})();

