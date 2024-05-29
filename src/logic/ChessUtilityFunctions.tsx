function validateMove(pos_x, pos_y, board_state, board_color, piece_color){

    console.log(`board_state: ${board_state}`)
    console.log(`board_dims: ${board_state.length} x ${board_state[0].length}`)
    console.log(`pos_x: ${pos_x}, pos_y: ${pos_y}`)
    let board_dims = [board_state.length, board_state[0].length]

    let ans = false

    let res = pos_y < 0 || pos_x >= board_dims[0] || pos_y >= board_dims[1] || pos_x <= 0
    ans ||= res
    if ( !res ) {
        ans ||= board_state[pos_x][pos_y] != '.' && piece_color == board_color[pos_x][pos_y]
    }
    return !ans
}



function compute_rook_moves(board_state, board_color, cpos, piece_color){
    let opos = []
    let dir = [ [1, 0], [0, 1], [-1, 0], [0, -1]]
    for (const ndir of dir) {
        let npos = [cpos[0] + ndir[0], cpos[1] + ndir[1]]
        while (true) {
            let validate = validateMove(...npos, board_state, board_color, piece_color)
            if (validate) {
                opos.push([npos[0], npos[1]])
                npos[0] += ndir[0]
                npos[1] += ndir[1]
            } else {
                break
            }
        }
    }


    return opos
}

function compute_knight_moves(board_state, cpos) {
    let opos = []
    let nxt_pos = [ [1, 2], [-1, 2], [-1, -2], [1, -2], [2, 1], [2, -1], [-2, -1], [-2, 1] ]
    for (const pos of nxt_pos) {
        if (0 <= pos[0] && pos[0] < board_state.length && 0 <= pos[1] && pos[1] < board_state[0].length && 
            board_state[pos[0]][pos[1]] != '.'){
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

function compute_bishop_moves(board_state, board_color, cpos, piece_color){
    let opos = []
    let nxt_pos = [ [1, 1], [1, -1], [-1, 1], [-1, -1] ]
    for (let pos of nxt_pos) {
        let ncpos = [cpos[0] + pos[0], cpos[1] + pos[1]]
        while (true) {
            let validate = validateMove(...ncpos, board_state, board_color, piece_color)
            if (validate) {
                opos.push([ncpos[0], ncpos[1]])
                ncpos[0] += pos[0]
                ncpos[1] += pos[1]
            } else {
                break
            }
        }
    }
    return opos
}


function compute_available_moves(board_state, board_color, cpos, piece_color) {
    let value = board_state[cpos[0]][cpos[1]]
    let opos = []

    console.log(`CPOS: ${cpos}`)
    console.log(cpos.length)
    console.log(`Value: ${value}`)
    switch(value){
        case 'r':
            console.log("rook")
            opos = compute_rook_moves(board_state, board_color, cpos, piece_color)
            break
        case 'k':
            console.log("knight")
            opos = compute_knight_moves(board_state, cpos)
            break
        case 'b':
            console.log("bishop")
            opos = compute_bishop_moves(board_state, board_color, cpos, piece_color)
            break
        case 'q':
            console.log("queen")
            opos = [...compute_rook_moves(board_state, board_color, cpos, piece_color), ...compute_bishop_moves(board_state, board_color, cpos, piece_color)]
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
                if (cpos[1] - 1 >= 0 && cpos[1] - 1 >= 0 && board_state[cpos[0]-1][cpos[1]-1] != '.'){
                    opos.push([cpos[0] - 1, cpos[1] - 1])
                }
                if ( cpos[0]-1 >= 0 && board_state[cpos[0]-1][cpos[1]] == '.'){
                    opos.push([cpos[0] -1 , cpos[1]])
                }
                if (cpos[0]-1 >= 0 && cpos[1] + 1 < board_state.length && board_state[cpos[0]-1][cpos[1]+1] != '.'){
                    opos.push([cpos[0] - 1, cpos[1]+1])
                }
                if (cpos[0] == 6){
                    opos.push([cpos[0] - 2, cpos[1]])
                }
            } else {
                if (cpos[0] + 1 < board_state.length){
                    if (cpos[1] - 1 >= 0 && cpos[1] - 1 < board_state.length && board_state[cpos[0]+1][cpos[1]-1] != '.'){
                        opos.push([cpos[0] + 1, cpos[1] - 1])
                    }

                    if (board_state[cpos[0]+1][cpos[1]] == '.'){
                        opos.push([cpos[0] + 1 , cpos[1]])
                    }
                    if (cpos[1] - 1 < board_state.length){
                        if (board_state[cpos[0]+1][cpos[1]+1] !='.'){
                            opos.push([cpos[0] + 1, cpos[1]+1])
                        }
                    }
                    if (cpos[0] == 1){
                        opos.push([cpos[0] + 2, cpos[1]])
                    }
                }
            }
            break
        default:
            break
    }


    return opos
}


export default compute_available_moves;