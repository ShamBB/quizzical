import React from 'react';
import Quiz from "./components/Quiz"
import StartGame from "./components/StartGame"
import { nanoid } from 'nanoid'
import he from 'he';

export default function App() {
    const [quizData,setQuizData] = React.useState([])
    const [startGame, setStartGame] = React.useState(false)
    const [submitAnswer, setSubmitAnswer] = React.useState(false)
    const [correctAnswers, setCorrectAnswers] = React.useState(0)
    
    React.useEffect(() => {
        if(startGame){
            fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => {
                 const quizDataArr = data.results.map((objQuiz) => {
                    const answerArr = []
                    const incorrectAnswerArr = objQuiz.incorrect_answers
                    
                    //== put incorrect answer and correct answer into one array
                    incorrectAnswerArr.map((answerObj) => {
                        answerArr.push(combineObjQuiz(answerObj,false))
                    })
                    
                    //==push correct answer randomly
                    const correctAnswer = combineObjQuiz(objQuiz.correct_answer,true)
                    let randomIndex = Math.floor(Math.random() * (answerArr.length + 1));
                    answerArr.splice(randomIndex, 0, correctAnswer);
                    return {id:nanoid(),...objQuiz,question : he.decode(objQuiz.question),answerArr}
                    
                })
                setQuizData(quizDataArr)
            })
        }  
    },[startGame])
    
    function combineObjQuiz(answerText,isCorrectAnswer){
        return  {
            id : nanoid(),
            answerText: he.decode(answerText),
            isCorrectAnswer : isCorrectAnswer,
            isUserChoice: false
        }
    }
    
    function chooseAnswer(quizId,answerId){
        setQuizData((prevQuizData) => {
            
            const newQuizArr = prevQuizData.map((quizObj) => {
                let newAnswerArr = quizObj.answerArr;
                if(quizObj.id === quizId){
                    newAnswerArr =  quizObj.answerArr.map((answerObj) => {
                        if(answerObj.id === answerId){
                            answerObj.isUserChoice = true;
                        }else{
                            answerObj.isUserChoice = false;
                        }
                        return {...answerObj}
                    })
                }
                return {...quizObj, answerArr : newAnswerArr}
            })
            return newQuizArr
        })
    }
    
    function checkAnswer(){
        setSubmitAnswer(!submitAnswer)
        let countCorrectAnswer = 0;
        quizData.forEach((quizObj) => {
            quizObj.answerArr.forEach((answerObj) => {
                if( answerObj.isCorrectAnswer && answerObj.isUserChoice){
                    countCorrectAnswer++;
                }
            })
        })
        setCorrectAnswers(countCorrectAnswer)
    }
    
    function playAgain(){
        setSubmitAnswer(!submitAnswer)
        setStartGame(!startGame)
        setQuizData([])
    }
    
    const quizEl = quizData.map((quizObj,index) => {
        return (
            <Quiz 
            key={quizObj.id}
            Quiz={quizObj} 
            chooseAnswer={chooseAnswer} 
            startGame = {startGame}
            submitAnswer = {submitAnswer}
            />
        )
    })
    
    
    
  return (
    <main>
        {quizData.length > 0 && startGame? 
            <>
                {quizEl}
                <div className="button-section">
                    { submitAnswer && <p>You scored {correctAnswers}/{quizData.length}  correct answers</p>}
                    <button className="submit-button" onClick={submitAnswer ? playAgain : checkAnswer }>{submitAnswer? "Play again" : "Check answers"}</button>
                </div>
            </>
            :
            <StartGame setStartGame={() => setStartGame((prevData) => !prevData)}/>
        }
    </main>
  )
}