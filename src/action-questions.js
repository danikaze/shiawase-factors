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

  function waitFor(condition, timeout) {
    const promise = new Promise((resolve) => {
      evalCondition(resolve);
    });

    timeout = timeout || 1000;

    function evalCondition(resolve) {
      if (condition()) {
        resolve();
      } else {
        setTimeout(evalCondition, timeout, resolve);
      }
    }

    return promise;
  }

  function shiawaseSetData(data) {
    xml = JSON.parse(data);
    waitFor(() => document.getElementById('btnArea')).then(injectHintButton);
  }

  function checkAnswers(answer) {
    for (let i = 0; ; i++) {
      const ans = document.getElementById(`choice-text${i}`);
      if (!ans) {
        return;
      }
      if (ans.classList.contains('checked-color') ^ answer.indexOf(i) !== -1) {
        ans.click();
      }
    }
  }

  function getAnswers(qElem) {
    const questions = xml.assessment.questions.question;
    const text = qElem.innerHTML;
    const question = questions.filter((elem) => elem._question === text);

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
    if (document.getElementById(BUTTON_ID)) {
      return;
    }
    const button = document.createElement('div');
    const parent = document.getElementById('btnArea');

    if (!parent) {
      return;
    }

    button.id = BUTTON_ID;
    button.innerHTML = '<span>Hint</span>';
    applyStyle(button, buttonStyle);
    applyStyle(button.children[0], buttonContentStyle);

    button.addEventListener('click', hint);
    parent.appendChild(button);
  }

  window.shiawaseSetData = shiawaseSetData;
})();

