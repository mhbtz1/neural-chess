function compute_rook_moves(board_state, cpos){
    let opos = []
    let term = 0
    for (let i = 0; i < board_state.length; i++){
            if (i < cpos[0]) {
                if (board_state[cpos[0]][i] != '.'){
                    if (term == 0){
                        term += 1;
                    }
                } else {
                    opos.push([cpos[0], i])
                }
            } else {
                opos.push([cpos[0], i])
                if (board_state[cpos[0]][i] != '.'){
                    if (term == 1){ 
                        term += 1;
                        break;
                    }
                }
            }
 
    }
    term = 0;
    for (let i = 0; i < board_state[0].length; i += 1){
        if (i < cpos[1]){       
             if (board_state[i][cpos[1]] != '.'){
                if (term == 0){
                    term += 1
                }
            } else {
                opos.push([i, cpos[1]])
            }
        } else {
            opos.push([i, cpos[1]])
            if (board_state[i][cpos[1]] != '.'){
                if (term == 1){
                    term += 1;
                    break;
                }
            }
        }
    }

    return opos
}

function compute_knight_moves(board_state, cpos) {
    let opos = []
     let nxt_pos = [ [1, 2], [-1, 2], [-1, -2], [1, -2], [2, 1], [2, -1], [-2, -1], [-2, 1] ]
            for (const pos of nxt_pos) {
                if (board_state[pos[0]][pos[1]] != '.'){
                    continue
                }
                if (pos[0] + cpos[0] < 0 || pos[0] + cpos[0] >= board_state[0].length) {
                    continue
                }
                if (pos[1] + cpos[1] < 0 || pos[1] + cpos[1] >= board_state[1].length){
                    continue
                }
                opos.push([pos[0] + cpos[0], pos[1] + cpos[1]])
    }
    return opos
}

function compute_bishop_moves(board_state, cpos){
    let opos = []
    let nxt_pos = [ [1, 1], [1, -1], [-1, 1], [-1, -1] ]
    for (let pos of nxt_pos) {
        let ncpos = [...cpos]
        while (ncpos[0] < board_state.length && ncpos[1] < board_state[0].length) {
            console.log(ncpos)
            if (pos[0] + ncpos[0] < 0 || pos[0] + ncpos[0] >= board_state[0].length) {
                continue
            }
            if (pos[1] + ncpos[1] < 0 || pos[1] + ncpos[1] >= board_state[1].length){
                continue
            }
            opos.push([pos[0] + ncpos[0], pos[1] + ncpos[1]])
            if (board_state[pos[0] + ncpos[0]][pos[1] + ncpos[1]] != '.'){
                break
            }
            ncpos[0] += pos[0]
            ncpos[1] += pos[1]
        }
    }
    return opos
}


function compute_available_moves(board_state, cpos, piece_color) {
    let value = board_state[cpos[0]][cpos[1]]
    let opos = []

    console.log(`CPOS: ${cpos}`)
    console.log(cpos.length)
    switch(value){
        case 'r':
            console.log("rook")
            opos = compute_rook_moves(board_state, cpos)
            break
        case 'k':
            console.log("knight")
            opos = compute_knight_moves(board_state, cpos)
            break
        case 'b':
            console.log("bishop")
            opos = compute_bishop_moves(board_state, cpos)
            break
        case 'q':
            console.log("queen")
            opos = [...compute_rook_moves(board_state,cpos), ...compute_bishop_moves(board_state, cpos)]
            break
        case 'K':
            console.log("king")
            let dx = [-1, 0, 1, 0, 1, -1, 1, -1]
            let dy = [0,  1, 0, -1, 1, 1, -1, -1]
            for (let i = 0; i < dx.length; i++){
                if (cpos[0] + dx[i] < 0 || cpos[0] + dx[i] >= board_state.length){
                    break
                }
                if (cpos[1] + dy[i] < 0 || cpos[1] + dy[i] >= board_state.length){
                    break
                }
                opos.push( [cpos[0] + dx[i], cpos[1] + dy[i]] )
            }
            break
        case 'p':
            console.log("pawn")
            if (piece_color == 'b') {
                if (cpos[1] - 1 >= 0 && cpos[1] - 1 >= 0 && board_state[cpos[0]-1][cpos[1]-1] == '.'){
                    opos.push([cpos[0] - 1, cpos[1] - 1])
                }
                if ( cpos[0]-1 >= 0 && board_state[cpos[0]-1][cpos[1]] == '.'){
                    opos.push([cpos[0] -1 , cpos[1]])
                }
                if (cpos[0]-1 >= 0 && cpos[1] + 1 < board_state.length && board_state[cpos[0]-1][cpos[1]+1] == '.'){
                    opos.push([cpos[0] - 1, cpos[1]+1])
                }
            } else {
                if (cpos[0] + 1 < board_state.length){
                    if (cpos[1] - 1 >= 0 && cpos[1] - 1 < board_state.length && board_state[cpos[0]+1][cpos[1]-1] == '.'){
                        opos.push([cpos[0] + 1, cpos[1] - 1])
                    }

                    if (board_state[cpos[0]+1][cpos[1]] == '.'){
                        opos.push([cpos[0] + 1 , cpos[1]])
                    }
                    if (cpos[1] - 1 < board_state.length){
                        if (board_state[cpos[0]+1][cpos[1]+1]=='.'){
                            opos.push([cpos[0] + 1, cpos[1]+1])
                        }
                    }
                }
            }
            break
        default:
            break
    }


    return opos
}


module.exports = {
    "compute_available_moves" : compute_available_moves
}