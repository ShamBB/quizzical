import React from "react"

export default function StartGame(props){
    return (
        <div className="main-container">
            <h1>Quizzical</h1>
            <button className="new-game-btn" onClick={props.setStartGame}>Start quiz</button>
        </div>
    )
}

