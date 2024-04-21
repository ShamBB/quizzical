import React from "react"


export default function Quiz(props){
    const quiz = props.Quiz;
    const answerEl = quiz.answerArr.map((answerObj) => {
        let classAnswerStat = ""
        if(props.submitAnswer && answerObj.isCorrectAnswer){
            if(answerObj.isUserChoice == answerObj.isCorrectAnswer){
                classAnswerStat = "correct"
            }else if(answerObj.isUserChoice != answerObj.isCorrectAnswer){
                classAnswerStat = "wrong"
            }
        }else if(!props.submitAnswer && answerObj.isUserChoice){
            classAnswerStat = "active"
        }
        
        return (<div key={answerObj.id} 
            className={`answer-pill ${classAnswerStat}`} 
            onClick={() => props.chooseAnswer(quiz.id,answerObj.id)}>{answerObj.answerText}</div>
        )
    })
    return (
        <div className="question-container">
            <h2>{quiz.question}</h2>
            <div className="answer-container">
               {answerEl}
            </div>
        </div>
    )
}