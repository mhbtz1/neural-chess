import React, {useState} from 'react'
import compute_available_moves from '../logic/ChessUtilityFunctions'
import "../css/button.css"
import { Button } from '@mui/material';

export const GRID_SIZE = 80


function Board() {
    let piece_ordering = ["rkbqKbkr",
                          "pppppppp",
                         "........",
                         "........",
                         "........",
                         "........",
                         "pppppppp",
                         "rkbqKbkr"
                        ]
    let piece_coloring = ["wwwwwwww",
                          "wwwwwwww",
                          "........",
                          "........",
                          "........",
                          "........",
                          "bbbbbbbb",
                          "bbbbbbbb"]
    let defaultCellColors = []


    let whiteBoardState = new Map()
    let blackBoardState = new Map()
    for (let i = 0; i < 2; i++){
        for (let j = 0; j < 8; j++){
            whiteBoardState.set(piece_ordering[i][j], [i, j] )
        }
    }
    for (let i = 6; i < 7; i++){
        for (let j = 0; j < 8; j++){
            blackBoardState.set(piece_ordering[i][j], ( [i, j] ) )
        }
    }
    for (let i = 0; i < 8; i++) {
        let boardRow = []
        for (let j = 0; j < 8; j++){
            if ( (i + j) % 2 === 0){
                boardRow.push("white")
            } else {
                boardRow.push("gray")
            }
        }
        defaultCellColors.push(boardRow)
    }

    const [cellBackgroundColors, setCellBackgroundColors] = useState(defaultCellColors)
    const [selected, setSelected] = useState([])
    const [pieceOrdering, setPieceOrdering] = useState(piece_ordering)
    const [pieceColoring, setPieceColoring] = useState(piece_coloring)
    const [colorMove, setColorMove] = useState('w')

    const moveComponent = (state, coord, flag) => {

        let curString = [...state[coord[0]]]
        curString[coord[1]] = state[selected[0]][selected[1]]
        state[coord[0]] = curString
        let nxtString = [...state[selected[0]]]

        nxtString[selected[1]] = '.'
        state[selected[0]] = nxtString
        if (flag === 0){
            setPieceOrdering(state)
            for (let i = 0; i < piece_ordering.length; i += 1){
                for (let j = 0; j < piece_ordering[0].length; j += 1){
                    console.log(`${i}, ${j} : ${piece_ordering[i][j]}`)
                }
                console.log('\n')
            }
        } else {
            setPieceColoring(state)
        }
    }
    
    const movePiece = (coord) => {
        moveComponent(pieceOrdering, coord, 0)
        moveComponent(pieceColoring, coord, 1)
    }

    const clickEvent = (event) => {
        
        const LOWER_X = 645
        const LOWER_Y = 0
        console.log("RUN!")

        let pos = [event.clientX, event.clientY]
        console.log(`pos; ${pos}`)
        let coord = [ Math.floor((pos[1] - LOWER_Y) / (GRID_SIZE)), Math.floor((pos[0] - LOWER_X)/(GRID_SIZE)) ]
        let piece_ordering = [...pieceOrdering]
        let piece_coloring = [...pieceColoring]
        let cell_background = [...defaultCellColors]

        let availCells = []
        if (selected.length > 0){
            availCells = compute_available_moves(piece_ordering, piece_coloring, selected, piece_coloring[coord[0]][coord[1]])
        }

        if (selected.toString() === [].toString() && piece_ordering[coord[0]][coord[1]] != '.'){
            console.log(`Current selected piece's color: ${piece_coloring[coord[0]][coord[1]]}`)
            if (piece_coloring[coord[0]][coord[1]] != colorMove) {
                console.log(`It is currently ${colorMove}'s turn. You cannot move currently.`)
                return
            }
            let availCells = compute_available_moves(piece_ordering, piece_coloring, coord, piece_coloring[coord[0]][coord[1]])
            setCellBackgroundColors(defaultCellColors)

            for (const cell of availCells) {
                let [x, y] = cell
                cell_background[x][y] = "red"
            }
            setCellBackgroundColors(cell_background)
        }

        if (selected.length === 0 && piece_ordering[coord[0]][coord[1]] !== '.' 
            && piece_coloring[coord[0]][coord[1]] == colorMove ){
            console.log("SELECTED!")
            setSelected(coord)
        } else if (selected.toString() === coord.toString() ) {
            console.log("Same piece selected. resetting...")
            setSelected([])
            for (let i = 0; i < defaultCellColors.length; i++) {
                for (let j = 0; j < defaultCellColors[i].length; j++){
                    cell_background[i][j] = defaultCellColors[i][j]
                }
            }
            setCellBackgroundColors(cell_background)
        } else if (selected.length > 0 && availCells.includes(coord)){
            console.log("MOVED!")
            console.log(`Final position: ${coord[0]}, ${coord[1]}`)
            
            let nxtMove = colorMove == 'w' ? 'b' : 'w'

            movePiece(coord)
            setSelected([])
            setColorMove(nxtMove)
            for (let i = 0; i < defaultCellColors.length; i++) {
                for (let j = 0; j < defaultCellColors[i].length; j++){
                    cell_background[i][j] = defaultCellColors[i][j]
                }
            }
            setCellBackgroundColors(cell_background)
            
        }
            
    }


    let boardCode = []
    let pos = [0, 0]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let s = `w-20 h-20 bg-${cellBackgroundColors[i][j]}-600 border border-black flex justify-center items-center`
            boardCode.push(<PieceRender pieceColor={pieceColoring[i][j]} className={s} pieceName={pieceOrdering[i][j]} 
                    onClick={clickEvent}> </PieceRender>)   
            pos[1] += 1
        }
        pos[0] += 1
        pos[1] = 0
    }


    let properRows = []
    for (let i = 0; i < 8; i ++) {
        let wstr = `row-${i}`
        properRows.push(<div className = "flex flex-row justify-center items-center" id={wstr} >
                                {boardCode.slice(8*i, 8*(i+1))} 
                        </div>)
    }

    const backendCall = async (event) => { 
        event.preventDefault();

        const formData = new FormData(this);

        // Make a POST request to the backend endpoint
        const response = await fetch("/submit_form", {
            method: "POST",
            body: formData
        })
        
        if (!response.ok) {
                throw new Error("Network response was not ok");
        } else {
            return response.text(); // Parse response as text
        }

    }


    const color = colorMove === 'w' ? 'white' : 'black'
    return (
        <>
            <section>
            <div className="chessboard">
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
                {properRows}
            </div>
            <div className= 'w-50 h-20' style={{'position' : 'relative', 'left' : '460pt', 'margin-top': '50pt'}}>
                <Button variant="outlined"> {color} </Button>
            </div>
            </section>
        </>);

}

function PieceRender({pieceColor, className, pieceName, onClick}) {

    let mp = {"k" : "knight", "r" : "rook", "p" : "pawn", "b" : "bishop", "q" : "queen", "K": "king"}
    let mp2 = {"w": "white", "b": "black"}
    let fp = `/images/${mp2[pieceColor]}_${mp[pieceName]}.png`
    
    if (pieceName !== '.' && pieceColor !== '.') {
        const id = pieceColor + '_' + pieceName
        return (
                <div id={id} className={className} onClick={onClick}>
                    <img className="w-20 h-20 custom-opacity flex justify-center items-center" src={fp} 
                    alt={`${mp2[pieceColor]} ${mp[pieceName]}`}/>
                </div>
            )
    }

    return <div className={className} onClick={onClick}> </div>
}


export default Board;