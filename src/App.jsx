import {useState, useEffect} from 'react'
import axios from 'axios'

let userStats = {
    "1": {
      "answers": [
      
      ],
    },
    "2": {
      "answers": [

      ]
    },
    "3": {
      "answers": [

      ]
    }
  }

const App = () => {
  const [part, setPart] = useState(0) // 0-4
  const [question, setQuestion] = useState(0) // 1-24
  const [interfer, setInterfer] = useState('prompt') // 'prompt', 'question', 'none'
  const [interferQuestion, setInterferQuestion] = useState(1) // 1-3

  let startTime
  let endTime

  const numberQuestions = [
    {
      "id": "1",
      "correct": "38475829",
      "wrong": "38475828"
    },
    {
      "id": "2",
      "correct": "62385937",
      "wrong": "62386937"
    },
    {
      "id": "3",
      "correct": "28508451",
      "wrong": "28208451"
    }
  ]

  const start = () => {
    setPart(1)
  }

  const handleCorrectColor = () => {
    endTime = performance.now()
    userStats[String(part)].answers[String(question)] = {}
    userStats[String(part)].answers[String(question)]["value"] = "correct"
    userStats[String(part)].answers[String(question)]["time"] = (endTime - startTime) / 1000

    if (question % 8 === 0) {
      setInterfer('question')
    }
    setQuestion(question + 1)
  }

  const handleWrongColor = () => {
    endTime = performance.now()
    userStats[String(part)].answers[String(question)] = {}
    userStats[String(part)].answers[String(question)]["value"] = "wrong"
    userStats[String(part)].answers[String(question)]["time"] = (endTime - startTime) / 1000

    if (question % 8 === 0) {
      setInterfer('question')
    }
    setQuestion(question + 1)
  }

  const handleCorrectInter = () => {
    endTime = performance.now()
    userStats[String(part)].answers['interfer ' + String(interferQuestion)] = {}
    userStats[String(part)].answers['interfer ' + String(interferQuestion)]["value"] = "correct"
    userStats[String(part)].answers[String('interfer ' + interferQuestion)]["time"] = (endTime - startTime) / 1000
    
    setInterfer('prompt')
    setInterferQuestion(interferQuestion + 1)
  }

  const handleWrongInter = () => {
    endTime = performance.now()
    userStats[String(part)].answers[String(interferQuestion)] = {}
    userStats[String(part)].answers[String(interferQuestion)]["value"] = "correct"
    userStats[String(part)].answers[String(interferQuestion)]["time"] = (endTime - startTime) / 1000

    setInterfer('prompt')
    setInterferQuestion(interferQuestion + 1)
  }

  updatePart(question, part, interferQuestion, setInterfer,  setPart, setQuestion, setInterferQuestion)

  if (part === 0) {
    return (
      <div>
        <button className='start' onClick={start}>Click here to start...</button>
      </div>
    )
  } else if (part === 1) { 
    if (question === 0) {
      setTimeout(() => setQuestion(1), 5000)
      return (
        <div>
          <img id='vertical-align' />
          <div className='title'>
            <h1>Part 1</h1>
            <h2>Select the color that is identical to the prompt.</h2>
          </div>
        </div>
      )
    }
    startTime = performance.now()
    return <ColorQuestion question={question} handleCorrect={handleCorrectColor} handleWrong={handleWrongColor} />
  } else if (part === 2) {
    if (question === 0) {
      setTimeout(() => setQuestion(1), 5000)
      return (
        <div>
          <img id='vertical-align' />
          <div className='title'>
            <h1>Part 2</h1>
            <h2>Memorize the prompted numbers.</h2>
          </div>
        </div>
      )
    }
    if (interferQuestion < 4) {
      if (interfer === 'prompt') {
        const numberQuestion = numberQuestions.find((question) => Number(question.id) === interferQuestion)
        setTimeout(() => setInterfer('none'), 3000)
        return <PromptNumber number={numberQuestion.correct} />
      } else if (interfer === 'question') {
        startTime = performance.now()
        const numberQuestion = numberQuestions.find((question) => Number(question.id) === interferQuestion)
        return <NumberQuestion question={numberQuestion} handleCorrect={handleCorrectInter} handleWrong={handleWrongInter} />
      } else {
        startTime = performance.now()
        return <ColorQuestion question={question} handleCorrect={handleCorrectColor} handleWrong={handleWrongColor} />
      }
    }
  } else if (part === 3) {
    if (question === 0) {
      setTimeout(() => setQuestion(1), 5000)
      return (
        <div>
          <img id='vertical-align' />
          <div className='title'>
            <h1>Part 3</h1>
            <h2>Memorize the prompted tile patterns.</h2>
          </div>
        </div>
      )
    }
    if (interferQuestion < 4) {
      if (interfer === 'prompt') {
        setTimeout(() => setInterfer('none'), 3000)
        return <PromptTile tile={interferQuestion} />
      } else if (interfer === 'question') {
        startTime = performance.now()
        return <TileQuestion question={interferQuestion} handleCorrect={handleCorrectInter} handleWrong={handleWrongInter} />
      } else {
        startTime = performance.now()
        return <ColorQuestion question={question} handleCorrect={handleCorrectColor} handleWrong={handleWrongColor} />
      }
    }
  } else if (part === 4) {
    return (
      <div>
        {Object.keys(userStats).map((part, i) => {
          return (
            <table key={i}>
              <caption>
                PART {part}
              </caption>
              <thead>
                <tr>
                  <th scope='col'>Question</th>
                  <th scope='col'>Answer</th>
                  <th scope='col'>Time</th>
                </tr>
              </thead>
              <tbody>
                {userStats[part].answers.map((question, j) => {
                  return (
                    <tr key={j}>
                      <th scope='row'>#{j}</th>
                      <td>{question.value}</td>
                      <td>{question.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )
        })}
      </div>
    )
  }
} 

const updatePart = (question, part, interferQuestion, setInterfer, setPart, setQuestion, setInterferQuestion) => {
  if (part === 1 && question > 24) {
    setPart(2)
    setQuestion(0)
    setInterfer('prompt')
  } else if (part === 2 && interferQuestion > 3) {
    setPart(3)
    setQuestion(0)
    setInterferQuestion(1)
  } else if (part === 3 && interferQuestion > 3) {
    setPart(4)
  }
}

const ColorQuestion = ({question, handleCorrect, handleWrong}) => {
  const imgSrc = `images/Color_Questions/${question}`
  const option1 = Boolean(Math.floor(Math.random() * 2))
  const option2 = !option1

  return (
    <div>
      <img id='vertical-align' />
      <div className='colorQuestion'>
        <img className='colorPrompt' src={`${imgSrc}/Correct.png`} /> 
        <div className='break'></div>
        <input className='option' type='image' onClick={option1 ? handleCorrect : handleWrong} src={option1 ? `${imgSrc}/Correct.png` : `${imgSrc}/Wrong.png`} />
        <input className='option' type='image' onClick={option2 ? handleCorrect : handleWrong} src={option2 ? `${imgSrc}/Correct.png` : `${imgSrc}/Wrong.png`} />
      </div>
    </div>
  )
}

const PromptNumber = ({number}) => {
  return (
    <div className='numberPrompt'>
      <p>{number}</p>
    </div>
  )
}

const NumberQuestion = ({question, handleCorrect, handleWrong}) => {
  const option1 = Boolean(Math.floor(Math.random() * 2))
  const option2 = !option1

  return (
    <div>
      <img id='vertical-align' />
      <div className='interferQuestion'>
        <p>Which one is the original sequence?</p>
        <div className='break'></div>
        <button className='numberOption' onClick={option1 ? handleCorrect : handleWrong}>{option1 ? question.correct : question.wrong}</button>
        <button className='numberOption' onClick={option2 ? handleCorrect : handleWrong}>{option2 ? question.correct : question.wrong}</button>
      </div>
    </div>
  )
}

const PromptTile = ({tile}) => {
  return (
    <div className='tilePrompt'>
      <img src={`images/Tile_Questions/${tile}/correct.png`} />
    </div>
  )
}

const TileQuestion = ({question, handleCorrect, handleWrong}) => {
  const imgSrc = `images/Tile_Questions/${question}`
  const option1 = Boolean(Math.floor(Math.random() * 2))
  const option2 = !option1

  return (
    <div>
      <img id='vertical-align' />
      <div className='interferQuestion'>
        <p>Which one is the original sequence?</p>
        <div className='break'></div>
        <input className='optionTile' type='image' onClick={option1 ? handleCorrect : handleWrong} src={option1 ? `${imgSrc}/correct.png` : `${imgSrc}/wrong.png`} />
        <input className='optionTile' type='image' onClick={option2 ? handleCorrect : handleWrong} src={option2 ? `${imgSrc}/correct.png` : `${imgSrc}/wrong.png`} />
      </div>
    </div>
  )
}

export default App
