import React, {useEffect, useState, useRef} from 'react'
import { compute_available_moves } from './ChessUtilityFunctions'

export const LOWER_X = 645
export const LOWER_Y = 0
export const UPPER_X = 1276
export const UPPER_Y = 635
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

    let piece_colors = ["blk", "wt"]

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
            if ( (i + j) % 2 == 0){
                boardRow.push("white")
            } else {
                boardRow.push("gray")
            }
        }
        defaultCellColors.push(boardRow)
    }

    const [whitePiecePositions, setWhitePiecePositions] = useState(whiteBoardState)
    const [blackPiecePositions, setBlackPiecePositions] = useState(blackBoardState)
    const [cellBackgroundColors, setCellBackgroundColors] = useState(defaultCellColors)
    const [selected, setSelected] = useState([])
    const [pieceOrdering, setPieceOrdering] = useState(piece_ordering)

    const clickEvent = (event) => {
        console.log("RUN!")
        let pos = [event.clientX, event.clientY]
        console.log(`pos; ${pos}`)
        let coord = [ Math.floor((pos[1] - LOWER_Y) / (GRID_SIZE)), Math.floor((pos[0] - LOWER_X)/(GRID_SIZE)) ]

        if (piece_ordering[coord[0]][coord[1]] != '.'){
            let availCells = compute_available_moves(piece_ordering, coord)
            setCellBackgroundColors(defaultCellColors)

            let cp = Array.from(defaultCellColors)
            for (const cell of availCells) {
                let [x, y] = cell
                cp[x][y] = "red"
            }
            setCellBackgroundColors(cp)
        }

        if (selected.length == 0 && piece_ordering[coord[0]][coord[1]] != '.'){
            console.log("SELECTED!")
            setSelected(coord)
        } else if (selected.length > 0){
            console.log("MOVED!")
            let piece_ordering = Array.from(pieceOrdering)
            piece_ordering[selected[0]][selected[1]] = piece_ordering[coord[0]][coord[1]]
            piece_ordering[coord[0]][coord[1]] = '.'
            setPieceOrdering(piece_ordering)
        }
    }


    let boardCode = []
    let pos = [0, 0]
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let s = `w-20 h-20 bg-${cellBackgroundColors[i][j]}-600 border border-black flex justify-center items-center`
            boardCode.push(<PieceRender pieceColor={piece_coloring[i][j]} className={s} pieceName={piece_ordering[i][j]} 
                    onClick={clickEvent}> </PieceRender>)   
            pos[1] += 1
        }
        pos[0] += 1
        pos[1] = 0
    }


    let properRows = []
    for (let i = 0; i < 8; i ++) {
        properRows.push(<div className = "flex flex-row justify-center items-center">
                                {boardCode.slice(8*i, 8*(i+1))} 
                        </div>)
    }

    return (
            <div>
            <header className="flex justify-center"> <h1> Neural Chess Engine </h1></header>
            <div className="chessboard">
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
                {properRows}
            </div>
            </div>);

}

function PieceRender({pieceColor, className, pieceName, onClick}) {

    let mp = {"k" : "knight", "r" : "rook", "p" : "pawn", "b" : "bishop", "q" : "queen", "K": "king"}
    let mp2 = {"w": "white", "b": "black"}
    let fp = `./chess-assets/${mp2[pieceColor]}_${mp[pieceName]}.png`
    

    if (pieceName != '.' && pieceColor != '.') {
        const id = pieceColor + '_' + pieceName
        return (
                <div id={id} className={className} onClick={onClick}>
                    <img className="w-20 h-20 custom-opacity flex justify-center items-center" src={fp}  />
                </div>
            )
    }

    return <div className={className} onClick={onClick}>
           </div>
}


export default Board;